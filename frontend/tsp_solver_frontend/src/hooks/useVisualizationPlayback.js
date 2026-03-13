import { useEffect, useState } from "react";


export function useVisualizationPlayback(history, speed) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!history.length) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
      return;
    }

    setCurrentStepIndex((currentIndex) => Math.min(currentIndex, history.length - 1));
  }, [history]);

  useEffect(() => {
    if (!isPlaying || history.length < 2) {
      return undefined;
    }

    if (currentStepIndex >= history.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCurrentStepIndex((index) => Math.min(index + 1, history.length - 1));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [currentStepIndex, history.length, isPlaying, speed]);

  function resetPlayback() {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  function jumpToEnd() {
    setCurrentStepIndex(Math.max(history.length - 1, 0));
    setIsPlaying(false);
  }

  return {
    currentStep: history[currentStepIndex] || null,
    currentStepIndex,
    isPlaying,
    jumpToEnd,
    resetPlayback,
    setCurrentStepIndex,
    setIsPlaying,
  };
}
