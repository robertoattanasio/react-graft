const isSyntheticEvent = (value: unknown): boolean =>
  typeof value === "object" && value !== null && "nativeEvent" in value && "target" in value;

export const sanitizeSyntheticEvent = <T,>(payload: T): T | null => (isSyntheticEvent(payload) ? null : payload);
