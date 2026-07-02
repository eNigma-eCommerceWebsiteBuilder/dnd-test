'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/formatters';

interface PriceRangeSliderProps {
    minValue?: number;
    maxValue?: number;
    className?: string;
}

interface RangeValues {
    min: number;
    max: number;
}

interface PriceRangeSliderContentProps extends PriceRangeSliderProps {
    initialRange: RangeValues;
    pathname: string;
    searchParamsString: string;
}

function parseRangeParam(value: string | null, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function PriceRangeSliderContent({
    className,
    initialRange,
    maxValue = 5000,
    minValue = 0,
    pathname,
    searchParamsString,
}: PriceRangeSliderContentProps) {
    const router = useRouter();
    const [range, setRange] = useState<RangeValues>(initialRange);
    const debounceTimerRef = useRef<number | null>(null);

    const updateURL = useCallback((nextRange: RangeValues) => {
        const params = new URLSearchParams(searchParamsString);

        if (nextRange.min > minValue) {
            params.set('minPrice', nextRange.min.toString());
        } else {
            params.delete('minPrice');
        }

        if (nextRange.max < maxValue) {
            params.set('maxPrice', nextRange.max.toString());
        } else {
            params.delete('maxPrice');
        }

        params.delete('page');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [maxValue, minValue, pathname, router, searchParamsString]);

    const scheduleURLUpdate = useCallback((nextRange: RangeValues) => {
        if (debounceTimerRef.current !== null) {
            window.clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = window.setTimeout(() => {
            updateURL(nextRange);
        }, 500);
    }, [updateURL]);

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextMin = Math.min(Number.parseInt(event.target.value, 10), range.max - 10);
        const nextRange = { min: nextMin, max: range.max };

        setRange(nextRange);
        scheduleURLUpdate(nextRange);
    };

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextMax = Math.max(Number.parseInt(event.target.value, 10), range.min + 10);
        const nextRange = { min: range.min, max: nextMax };

        setRange(nextRange);
        scheduleURLUpdate(nextRange);
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current !== null) {
                window.clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const minPercent = ((range.min - minValue) / (maxValue - minValue)) * 100;
    const maxPercent = ((range.max - minValue) / (maxValue - minValue)) * 100;

    return (
        <div className={cn("@container", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-text-base">
                    Price Range
                </h3>
                <span className="material-symbols-outlined text-text-muted cursor-pointer hover:text-text-base transition-colors">
                    expand_less
                </span>
            </div>

            <div className="px-2">
                <div className="relative h-1 mb-6">
                    <div className="absolute inset-0 bg-border rounded-full" />
                    <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{
                            left: `${minPercent}%`,
                            width: `${maxPercent - minPercent}%`,
                        }}
                    />

                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step={10}
                        value={range.min}
                        onChange={handleMinChange}
                        className={cn(
                            "absolute w-full h-1 appearance-none bg-transparent pointer-events-none",
                            "[&::-webkit-slider-thumb]:pointer-events-auto",
                            "[&::-webkit-slider-thumb]:appearance-none",
                            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
                            "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full",
                            "[&::-webkit-slider-thumb]:cursor-pointer",
                            "[&::-webkit-slider-thumb]:shadow-md",
                            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-surface"
                        )}
                    />

                    <input
                        type="range"
                        min={minValue}
                        max={maxValue}
                        step={10}
                        value={range.max}
                        onChange={handleMaxChange}
                        className={cn(
                            "absolute w-full h-1 appearance-none bg-transparent pointer-events-none",
                            "[&::-webkit-slider-thumb]:pointer-events-auto",
                            "[&::-webkit-slider-thumb]:appearance-none",
                            "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
                            "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full",
                            "[&::-webkit-slider-thumb]:cursor-pointer",
                            "[&::-webkit-slider-thumb]:shadow-md",
                            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-surface"
                        )}
                    />
                </div>

                <div className="flex justify-between">
                    <div className="px-3 py-1.5 bg-bg-surface border border-border rounded-input text-xs font-bold text-text-base">
                        {formatPrice(range.min)}
                    </div>
                    <div className="px-3 py-1.5 bg-bg-surface border border-border rounded-input text-xs font-bold text-text-base">
                        {range.max >= maxValue ? `${formatPrice(maxValue)}+` : formatPrice(range.max)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PriceRangeSlider({
    minValue = 0,
    maxValue = 5000,
    className,
}: PriceRangeSliderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();
    const initialRange = useMemo<RangeValues>(() => ({
        min: parseRangeParam(searchParams.get('minPrice'), minValue),
        max: parseRangeParam(searchParams.get('maxPrice'), maxValue),
    }), [maxValue, minValue, searchParams]);

    return (
        <PriceRangeSliderContent
            key={`${pathname}:${searchParamsString}:${minValue}:${maxValue}`}
            className={className}
            initialRange={initialRange}
            maxValue={maxValue}
            minValue={minValue}
            pathname={pathname}
            searchParamsString={searchParamsString}
        />
    );
}

export default PriceRangeSlider;
