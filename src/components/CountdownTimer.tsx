import { useState, useEffect, useRef } from "react";

let startTimer: () => void;
let endTimer: () => void;
let resetTimer: () => void;
let getElapsedSeconds: () => number;

interface CountdownTimerProps {
  onEnd: () => void; // Function to call when the timer ends
  onReset?: () => void; // Optional function to call when the timer resets
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onEnd, onReset }) => {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0); // Track elapsed seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsed((prevElapsed) => prevElapsed + 1); // Increment elapsed seconds
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            onEnd(); // Call the onEnd function when the timer reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onEnd]);

  // Exportable functions
  startTimer = () => setIsActive(true);
  endTimer = () => setIsActive(false);
  resetTimer = () => {
    setTime(300);
    setElapsed(0); // Reset elapsed time
    setIsActive(false);
    if (onReset) onReset(); // Call the optional onReset function
  };
  getElapsedSeconds = () => elapsed; // Retrieve the elapsed time in seconds

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return <div>{formatTime(time)}</div>;
};

// Export the functions
export { startTimer as start, endTimer as end, resetTimer as reset, getElapsedSeconds as getElapsedTime };
export default CountdownTimer;
