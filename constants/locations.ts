export const LOCATION_CODES = [
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
] as const;

export type LocationCode = (typeof LOCATION_CODES)[number];

export const isValidLocationCode = (value: string): value is LocationCode => {
  return LOCATION_CODES.includes(value as LocationCode);
};
