import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { message } from 'antd';

import ButtonStyled from '@/containers/_global/_styles/_button';

declare interface Props {
  text: string;
  onFinish: () => void;
}

export default function Component({ text, onFinish }: Props) {
  const [isHold, setIsHold] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [count, setCount] = useState(0);
  const [finishCountDelay, setFinishCountDelay] = useState(3);
  const [restoreCountDelay, setRestoreCountDelay] = useState(3);
  const multiplier = 4;

  const enableHold = () => setIsHold(true);
  const disableHold = () => {
    setIsHold(false);
    setFinishCountDelay(3);
  };

  const handleFinish = useCallback(() => {
    message.success(`Execution started, Please wait a moment. Thank you!`);
    setIsComplete(true);
    onFinish();
  }, [onFinish]);

  const handleRestore = useCallback(() => {
    disableHold();
    setRestoreCountDelay(3);
    setIsComplete(false);
  }, []);

  const isFinish = useMemo(() => count >= 100, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isHold) {
        if (count < 100) setCount((count) => count + multiplier);
      } else {
        if (count > 0) setCount((count) => count - multiplier);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isHold, count]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFinish && finishCountDelay > 0)
        setFinishCountDelay((count) => count - 1);
      else if (isFinish && !isComplete) handleFinish();
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinish, isComplete, finishCountDelay, handleFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isComplete && restoreCountDelay > 0)
        setRestoreCountDelay((count) => count - 1);
      else if (isFinish && isComplete) handleRestore();
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isFinish, restoreCountDelay, handleRestore]);

  return (
    <ButtonStyled
      type="primary"
      className="w-[100%]"
      onClick={() => {
        if (count <= 0)
          message.warning('Press and hold to confirm the action.');
      }}
      onMouseDown={enableHold}
      onTouchStart={enableHold}
      onMouseUp={disableHold}
      onMouseLeave={disableHold}
      onTouchEnd={disableHold}
      disabled={isComplete}
      style={{
        backgroundColor: !isComplete
          ? `rgba(255, 183, 0, ${count / 100})`
          : `rgba(0, 183, 0, ${count / 100})`,
        borderColor: !isComplete ? '#ffb700' : '#00b700',
        color: count <= 70 ? '#ffb700' : 'white',
        fontWeight: 'bold',
      }}
    >
      {isComplete && `Restoring action in... ${restoreCountDelay}`}
      {!isComplete &&
        (!isFinish
          ? `${count <= 0 ? `${text} (Hold)` : `${count}%`}`
          : `Execution in... ${finishCountDelay}`)}
    </ButtonStyled>
  );
}
