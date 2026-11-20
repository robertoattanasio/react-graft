export type GraftCounter = {
  id: string;
  counter: number;
  duration: number;
  isCounting: boolean;
  start: (seconds?: number) => void;
  reset: () => void;
};

export type UseGraftCounterOptions = {
  duration?: number;
  defaultValue?: number | null;
  startOnLoad?: boolean;
};
