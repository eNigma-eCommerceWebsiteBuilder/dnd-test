export interface RatingResult {
  value: number;
  display: string;
  percentage: number;
  full: number;
  half: boolean;
  empty: number;
}

export function formatRating(rating: number, maxRating: number = 5): RatingResult {
  const normalizedRating = Number(rating) || 0;

  return {
    value: normalizedRating,
    display: normalizedRating.toFixed(1),
    percentage: (normalizedRating / maxRating) * 100,
    full: Math.floor(normalizedRating),
    half: normalizedRating % 1 >= 0.5,
    empty: maxRating - Math.ceil(normalizedRating),
  };
}
