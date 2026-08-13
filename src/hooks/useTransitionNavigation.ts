import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TRANSITION_DELAY = 1200;

export const useTransitionNavigation = (destination: string) => {
    const navigate = useNavigate();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(
        () => () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        },
        []
    );

    const startTransition = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        timeoutRef.current = setTimeout(() => {
            navigate(destination);
        }, TRANSITION_DELAY);
    };

    return { isTransitioning, startTransition };
};
