import { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';

const useCountdown = ({
  seconds,
  autoStart = true,
}: {
  seconds: number;
  autoStart?: boolean;
}): { secondsLeft: number; startTimer: () => void; stopTimer: () => void } => {
  const [secondsLeft, setSecondsLeft] = useState<number>(seconds);
  const [isStarted, setIsStarted] = useState<boolean>(autoStart);
  const [deadLine, setDeadline] = useState<moment.Moment | null>(null);
  const timerRef = useRef<number>(0);

  const startTimer = (): void => {
    setSecondsLeft(seconds);
    setDeadline(moment().add(seconds + 1, 'seconds'));
    setIsStarted(true);
  };

  const stopTimer = (): void => {
    setIsStarted(false);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    setDeadline(moment().add(seconds + 1, 'seconds'));
  }, [seconds]);

  useEffect(() => {
    const getTime = (): void => {
      if (!deadLine) {
        return;
      }
      const time = deadLine.valueOf() - moment().valueOf();
      if (time <= 0) {
        setSecondsLeft(0);
        clearInterval(timerRef.current);
        setIsStarted(false);
        return;
      }
      setSecondsLeft(Math.floor((time / 1000) % 60));
    };
    if (isStarted) {
      timerRef.current = setInterval(getTime, 1000);
    }

    return (): void => clearInterval(timerRef.current);
  }, [deadLine, secondsLeft, isStarted]);
  return { secondsLeft, startTimer, stopTimer };
};

export default useCountdown;
