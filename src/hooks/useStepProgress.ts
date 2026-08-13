import { useEffect, useState } from "react";

const DEFAULT_STEP_DURATION_MS = 1200;

export const useStepProgress = (
    stepCount: number,
    duration = DEFAULT_STEP_DURATION_MS
) => {
    const [completedCount, setCompletedCount] = useState(0);
    const isComplete = completedCount === stepCount;
    const progress =
        stepCount === 0 ? 100 : Math.round((completedCount / stepCount) * 100);

    useEffect(() => {
        if (isComplete) return;

        const timer = window.setTimeout(() => {
            setCompletedCount((previous) => previous + 1);
        }, duration);

        return () => window.clearTimeout(timer);
    }, [completedCount, duration, isComplete]);

    return { completedCount, isComplete, progress };
};
