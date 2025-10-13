import React, { useState, useRef, useEffect } from 'react';
import { IonModal, IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './ParentalGate.css';

interface ParentalGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Shape = 'circle' | 'square' | 'triangle';

const ParentalGate: React.FC<ParentalGateProps> = ({ isOpen, onClose, onSuccess }) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [targetShape, setTargetShape] = useState<Shape>('circle');
  const [instruction, setInstruction] = useState('');
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      // Randomize which shape to tap
      const shapes: Shape[] = ['circle', 'square', 'triangle'];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setTargetShape(randomShape);

      const shapeNames: Record<Shape, string> = {
        circle: 'the circle ⭕',
        square: 'the square ⬜',
        triangle: 'the triangle 🔺'
      };
      setInstruction(`Parents: Please tap ${shapeNames[randomShape]}`);
    } else {
      setHoldProgress(0);
    }
  }, [isOpen]);

  const updateProgress = () => {
    const elapsed = Date.now() - holdStartRef.current;
    const progress = Math.min((elapsed / 3000) * 100, 100);
    setHoldProgress(progress);

    if (progress < 100) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      handleSuccess();
    }
  };

  const handleHoldStart = () => {
    holdStartRef.current = Date.now();
    Haptics.impact({ style: ImpactStyle.Light });
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const handleHoldEnd = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setHoldProgress(0);
  };

  const handleShapeClick = (shape: Shape) => {
    if (shape === targetShape) {
      Haptics.impact({ style: ImpactStyle.Medium });
      handleSuccess();
    } else {
      Haptics.impact({ style: ImpactStyle.Heavy });
      setInstruction('Try again - look carefully!');
      setTimeout(() => {
        const shapeNames: Record<Shape, string> = {
          circle: 'the circle ⭕',
          square: 'the square ⬜',
          triangle: 'the triangle 🔺'
        };
        setInstruction(`Parents: Please tap ${shapeNames[targetShape]}`);
      }, 1500);
    }
  };

  const handleSuccess = () => {
    Haptics.impact({ style: ImpactStyle.Heavy });
    onSuccess();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="parental-gate-modal">
      <div className="parental-gate-content">
        <IonButton
          className="gate-close-button"
          fill="clear"
          onClick={onClose}
        >
          <IonIcon icon={close} />
        </IonButton>

        <div className="gate-header">
          <h2>Parent Verification</h2>
          <p className="gate-instruction">{instruction}</p>
        </div>

        <div className="gate-shapes">
          <button
            className="shape-button circle"
            onClick={() => handleShapeClick('circle')}
            aria-label="Circle"
          >
            ⭕
          </button>
          <button
            className="shape-button square"
            onClick={() => handleShapeClick('square')}
            aria-label="Square"
          >
            ⬜
          </button>
          <button
            className="shape-button triangle"
            onClick={() => handleShapeClick('triangle')}
            aria-label="Triangle"
          >
            🔺
          </button>
        </div>

        <div className="gate-divider">
          <span>OR</span>
        </div>

        <div className="gate-hold-section">
          <p className="gate-instruction">Hold the button for 3 seconds</p>
          <button
            className="hold-button"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            aria-label="Hold for 3 seconds"
          >
            <div className="hold-progress" style={{ width: `${holdProgress}%` }} />
            <span className="hold-text">HOLD</span>
          </button>
        </div>
      </div>
    </IonModal>
  );
};

export default ParentalGate;
