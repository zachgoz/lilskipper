import { spawn } from 'node:child_process';

const MCP_PROTOCOL_VERSION = '2025-06-18';

const server = spawn('npx', ['-y', 'chrome-devtools-mcp', '--isolated'], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
});

server.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`chrome-devtools-mcp exited with code ${code ?? 'null'} signal ${signal ?? 'null'}`);
  }
});

let buffer = '';
const pending = new Map();
let nextId = 1;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

server.stdout.on('data', (data) => {
  buffer += data.toString('utf8');
  processBuffer();
});

function processBuffer() {
  while (true) {
    const newlineIndex = buffer.indexOf('\n');
    if (newlineIndex === -1) {
      return;
    }

    const raw = buffer.slice(0, newlineIndex).replace(/\r$/, '');
    buffer = buffer.slice(newlineIndex + 1);

    if (!raw.trim()) {
      continue;
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      console.error('Failed to parse JSON payload:', raw);
      throw err;
    }

    handleMessage(payload);
  }
}

function send(payload) {
  const json = JSON.stringify(payload);
  server.stdin.write(`${json}\n`, 'utf8');
}

function request(method, params = {}) {
  const id = nextId++;
  const payload = {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    send(payload);
  });
}

function notify(method, params = {}) {
  send({
    jsonrpc: '2.0',
    method,
    params,
  });
}

function handleMessage(message) {
  if (Object.prototype.hasOwnProperty.call(message, 'id')) {
    const { id, result, error } = message;
    const resolver = pending.get(id);
    if (!resolver) {
      console.warn('Received response for unknown id:', message);
      return;
    }
    pending.delete(id);

    if (error) {
      resolver.reject(error);
    } else {
      resolver.resolve(result);
    }
    return;
  }

  if (message.method === 'notifications/tools/list_changed') {
    // Ignore tool list notifications for this script.
    return;
  }

  // Log other notifications for visibility.
  console.log('Notification:', JSON.stringify(message));
}

async function callTool(name, args = {}) {
  const result = await request('tools/call', { name, arguments: args });
  return result;
}

function extractJson(result) {
  if (!result?.content || !Array.isArray(result.content)) {
    return null;
  }

  const joined = result.content
    .filter((block) => block?.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const match = joined.match(/```json\s*([\s\S]+?)\s*```/i);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[1]);
  } catch (err) {
    console.error('Failed to parse JSON from tool output:', match[1]);
    throw err;
  }
}

async function evalJson(fnSource) {
  const result = await callTool('evaluate_script', { function: fnSource });
  const data = extractJson(result);
  if (!data) {
    console.error('Unexpected evaluate_script output:', result);
    throw new Error('evaluate_script did not return JSON payload');
  }
  return data;
}

function buildSceneEval(body) {
  return `async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const findScene = () => {
      const phaser = window.Phaser;
      if (phaser?.GAMES?.length) {
        for (const game of phaser.GAMES) {
          const candidate = game?.scene?.keys?.BuildBoatScene;
          if (candidate) {
            return candidate;
          }
        }
      }

      for (const value of Object.values(window)) {
        if (!value || typeof value !== 'object') {
          continue;
        }
        const sceneManager = value.scene;
        if (sceneManager?.keys?.BuildBoatScene) {
          return sceneManager.keys.BuildBoatScene;
        }
      }

      return null;
    };

    const scene = findScene();
    if (!scene) {
      return { ready: false, reason: 'scene-not-found' };
    }

    ${body}
  }`;
}

async function waitForSceneReady(maxAttempts = 120) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await evalJson(buildSceneEval(`
      if (!scene.sys?.isActive?.()) {
        await wait(100);
        return { ready: false, reason: 'scene-not-active' };
      }
      if (!scene.levelData || !scene.levelData.parts) {
        return { ready: false, reason: 'level-not-ready' };
      }
      return {
        ready: true,
        currentLevel: scene.currentLevel ?? null,
        levelId: scene.levelData.id ?? null,
        parts: scene.levelData.parts?.length ?? 0
      };
    `));

    if (status.ready) {
      return status;
    }

    console.log(
      `Scene not ready yet (attempt ${attempt + 1}/${maxAttempts}):`,
      status.reason ?? 'unknown'
    );

    await wait(500);
  }

  throw new Error('Timed out waiting for BuildBoatScene readiness');
}

async function main() {
  console.log('Initializing Chrome DevTools MCP session…');

  await request('initialize', {
    protocolVersion: MCP_PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: {
      name: 'diagnose-script',
      version: '0.1.0',
    },
  });

  notify('notifications/initialized');

  console.log('Opening Boat Builder page…');
  const newPageResult = await callTool('new_page', {
    url: 'http://localhost:5173/game/build-boat',
    timeout: 0,
  });
  console.log('new_page response:', newPageResult);
  await wait(3000);

  const consoleMessages = await callTool('list_console_messages');
  console.log(
    'Console messages:',
    JSON.stringify(consoleMessages?.structuredContent ?? consoleMessages, null, 2)
  );

  const pages = await callTool('list_pages');
  console.log('list_pages raw result:', pages);
  const structuredPages = pages?.structuredContent?.pages ?? [];
  const pageSummaries = structuredPages.map((page, index) => ({
    index,
    url: page?.url,
    title: page?.title,
  })) ?? [];
  console.log('Open pages:', pageSummaries);

  const target = pageSummaries.find((page) =>
    typeof page.url === 'string' && page.url.includes('/game/build-boat')
  );
  if (target) {
    console.log('Selecting page index', target.index);
    await callTool('select_page', { pageIdx: target.index });
  } else {
    console.warn('Boat Builder page not found in list_pages result – continuing with current selection.');
  }

  const snapshot = await callTool('take_snapshot');
  console.log('take_snapshot result:', JSON.stringify(snapshot).slice(0, 500));
  const elementCount = snapshot?.structuredContent?.snapshot?.elements?.length ?? 0;
  const titles = snapshot?.snapshot?.elements
    ?.filter((el) => el.attributes?.['data-testid'])
    ?.slice(0, 5)
    ?.map((el) => ({
      uid: el.uid,
      name: el.name,
      testId: el.attributes['data-testid'],
    }));
  console.log('Snapshot element count:', elementCount);
  if (titles && titles.length > 0) {
    console.log('Sample snapshot entries:', titles);
  }

  const windowHints = await evalJson(`() => {
    const keys = Object.keys(window);
    return {
      ready: true,
      phaserKeys: keys.filter((key) => key.toLowerCase().includes('phaser')).slice(0, 20),
      sceneKeys: keys.filter((key) => key.toLowerCase().includes('scene')).slice(0, 20)
    };
  }`);
  console.log('Window inspection hints:', windowHints);

  const phaserState = await evalJson(`() => {
    const phaser = window.Phaser;
    return {
      ready: true,
      hasPhaser: Boolean(phaser),
      gameCount: phaser?.GAMES?.length ?? null,
      gameKeys: phaser?.GAMES?.map((game) => Object.keys(game?.scene?.keys ?? {})) ?? []
    };
  }`);
  console.log('Phaser global state:', phaserState);

  const gameCandidates = await evalJson(`() => {
    const values = Object.values(window);
    const matches = [];
    for (const value of values) {
      if (!value || typeof value !== 'object') continue;
      const ctor = value.constructor?.name ?? '';
      if (ctor === 'Game' || ctor === 'Phaser.Game') {
        matches.push({
          constructor: ctor,
          sceneKeys: Object.keys(value.scene?.keys ?? {}),
        });
      }
    }
    return { ready: true, matches };
  }`);
  console.log('Potential game objects:', gameCandidates);

  const canvasState = await evalJson(`() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      return { ready: true, hasCanvas: false };
    }
    return {
      ready: true,
      hasCanvas: true,
      phaserProps: Object.getOwnPropertyNames(canvas).filter((key) =>
        key.toLowerCase().includes('phaser')
      ),
      dataset: canvas.dataset,
      width: canvas.width,
      height: canvas.height
    };
  }`);
  console.log('Canvas inspection:', canvasState);

  const reactFiberInfo = await evalJson(`() => {
    const container = document.querySelector('.phaser-game-container');
    if (!container) {
      return { ready: true, found: false };
    }
    const fiberKey = Object.keys(container).find((key) => key.startsWith('__reactFiber'));
    if (!fiberKey) {
      return { ready: true, found: true, fiberKey: null };
    }
    const fiber = container[fiberKey];
    const hookSnapshots = [];
    let node = fiber?.return?.memoizedState;
    let guard = 0;
    while (node && guard < 20) {
      hookSnapshots.push({
        hasState: Boolean(node.memoizedState),
        stateType: typeof node.memoizedState,
        stateKeys: node.memoizedState && typeof node.memoizedState === 'object'
          ? Object.keys(node.memoizedState)
          : null,
        currentKeys: node.memoizedState?.current
          ? Object.keys(node.memoizedState.current)
          : null
      });
      node = node.next;
      guard += 1;
    }
    return { ready: true, found: true, fiberKey, hooks: hookSnapshots };
  }`);
  console.log('React fiber inspection:', reactFiberInfo);

  const readyInfo = await waitForSceneReady();
  console.log('Scene ready:', readyInfo);

  const initialInfo = await evalJson(buildSceneEval(`
    return {
      ready: true,
      currentLevel: scene.currentLevel ?? null,
      completedParts: scene.completedParts ?? null,
      levelId: scene.levelData?.id ?? null,
      partCount: scene.levelData?.parts?.length ?? null
    };
  `));
  console.log('Initial scene info:', initialInfo);

  console.log('Triggering level completion and tapping Next…');
  const nextResult = await evalJson(buildSceneEval(`
    if (typeof scene.completeLevel !== 'function') {
      return { error: 'completeLevel-missing' };
    }

    scene.completeLevel();
    await wait(2300);

    const rectangles = scene.children?.list
      ?.filter((child) => typeof child?.fillColor === 'number')
      ?.map((child) => ({
        type: child.constructor?.name,
        fillColor: child.fillColor,
        width: child.width,
        height: child.height,
        x: child.x,
        y: child.y,
        originX: child.originX,
        originY: child.originY,
        interactive: Boolean(child.input),
      })) ?? [];

    const buttonIndex = rectangles.findIndex(
      (rect) => rect.fillColor === 0x4caf50 || rect.fillColor === 5025616
    );

    if (buttonIndex === -1) {
      return {
        error: 'next-button-not-found',
        childSummary: scene.children?.list?.map((child) => child?.constructor?.name) ?? [],
        rectangles,
      };
    }

    const nextButton = scene.children?.list?.filter((child) => typeof child?.fillColor === 'number')[buttonIndex];
    nextButton.emit?.('pointerdown');
    await wait(800);

    return {
      ready: true,
      currentLevel: scene.currentLevel ?? null,
      levelId: scene.levelData?.id ?? null,
      partCount: scene.levelData?.parts?.length ?? null,
      completedParts: scene.completedParts ?? null,
      rectangles
    };
  `));
  console.log('After Next tap:', nextResult);

  const postRestartInfo = await evalJson(buildSceneEval(`
    return {
      ready: true,
      currentLevel: scene.currentLevel ?? null,
      levelId: scene.levelData?.id ?? null,
      partCount: scene.levelData?.parts?.length ?? null,
      completedParts: scene.completedParts ?? null
    };
  `));

  console.log('Scene info after restart settles:', postRestartInfo);

  if (!nextResult.error) {
    console.log('Triggering a second completion to test subsequent levels…');
    const secondResult = await evalJson(buildSceneEval(`
      if (typeof scene.completeLevel !== 'function') {
        return { error: 'completeLevel-missing' };
      }

      scene.completeLevel();
      await wait(2300);

      const rectangles = scene.children?.list
        ?.filter((child) => typeof child?.fillColor === 'number')
        ?.map((child) => ({
          type: child.constructor?.name,
          fillColor: child.fillColor,
          width: child.width,
          height: child.height,
          x: child.x,
          y: child.y,
          originX: child.originX,
          originY: child.originY,
          interactive: Boolean(child.input),
        })) ?? [];

      const buttonIndex = rectangles.findIndex(
        (rect) => rect.fillColor === 0x4caf50 || rect.fillColor === 5025616
      );

      if (buttonIndex === -1) {
        return { error: 'next-button-not-found-2', rectangles };
      }

      const nextButton = scene.children?.list?.filter((child) => typeof child?.fillColor === 'number')[buttonIndex];
      nextButton.emit?.('pointerdown');
      await wait(800);

      return {
        ready: true,
        currentLevel: scene.currentLevel ?? null,
        levelId: scene.levelData?.id ?? null,
        partCount: scene.levelData?.parts?.length ?? null,
        completedParts: scene.completedParts ?? null,
        rectangles
      };
    `));
    console.log('After second Next tap:', secondResult);
  }

  notify('notifications/shutdown');
  server.kill();
}

main().catch(async (err) => {
  console.error('Failed to run diagnosis:', err);
  try {
    notify('notifications/shutdown');
  } catch {
    // ignore
  }
  server.kill();
  process.exitCode = 1;
  process.exit(1);
});
