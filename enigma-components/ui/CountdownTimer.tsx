'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { calculateTimeRemaining, formatTimeRemaining } from '@/lib/utils/promotions';

interface CountdownTimerProps {
    targetDate: string;
    className?: string;
}

function getTimeLeft(targetDate: string) {
    const remaining = calculateTimeRemaining(targetDate, Date.now());

    if (remaining.isExpired) {
        return null;
    }

    return {
        days: remaining.days,
        hours: remaining.hours,
        minutes: remaining.minutes,
        seconds: remaining.seconds,
    };
}

export const CountdownTimer = ({ targetDate, className }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const animationFrameId = window.requestAnimationFrame(() => {
            setTimeLeft(getTimeLeft(targetDate));
        });

        const timer = setInterval(() => {
            const calculated = getTimeLeft(targetDate);
            if (!calculated) {
                clearInterval(timer);
            }
            setTimeLeft(calculated);
        }, 1000);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            clearInterval(timer);
        };
    }, [targetDate]);

    const ariaLabel = useMemo(() => {
        if (!timeLeft) return null;
        return formatTimeRemaining(
            {
                ...timeLeft,
                totalSeconds:
                    timeLeft.days * 86400 +
                    timeLeft.hours * 3600 +
                    timeLeft.minutes * 60 +
                    timeLeft.seconds,
                isExpired: false,
            },
            'full'
        );
    }, [timeLeft]);

    if (!timeLeft) return null;

    return (
        <div
            className={cn("@container w-full flex justify-center gap-2 @md:gap-4 font-mono", className)}
            aria-label={ariaLabel ?? undefined}
        >
            <div className="flex flex-1 min-w-0 flex-col items-center p-2 rounded-badge bg-bg-surface/50 backdrop-blur-sm border border-border/50">
                <span className="font-bold text-sm @md:text-lg leading-none">{timeLeft.days}</span>
                <span className="text-[9px] @md:text-[10px] uppercase text-text-muted mt-1">Days</span>
            </div>
            <div className="flex flex-1 min-w-0 flex-col items-center p-2 rounded-badge bg-bg-surface/50 backdrop-blur-sm border border-border/50">
                <span className="font-bold text-sm @md:text-lg leading-none">{timeLeft.hours}</span>
                <span className="text-[9px] @md:text-[10px] uppercase text-text-muted mt-1">Hrs</span>
            </div>
            <div className="flex flex-1 min-w-0 flex-col items-center p-2 rounded-badge bg-bg-surface/50 backdrop-blur-sm border border-border/50">
                <span className="font-bold text-sm @md:text-lg leading-none">{timeLeft.minutes}</span>
                <span className="text-[9px] @md:text-[10px] uppercase text-text-muted mt-1">Mins</span>
            </div>
            <div className="flex flex-1 min-w-0 flex-col items-center p-2 rounded-badge bg-bg-surface/50 backdrop-blur-sm border border-border/50">
                <span className="font-bold text-sm @md:text-lg leading-none">{timeLeft.seconds}</span>
                <span className="text-[9px] @md:text-[10px] uppercase text-text-muted mt-1">Secs</span>
            </div>
        </div>
    );
};
