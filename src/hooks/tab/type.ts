export type GraftTab = {
  id: string;
  tab: number;
  history: readonly number[];
  setTab: (tab: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export type UseGraftTabOptions = {
  defaultValue?: number;
  min?: number;
  max?: number;
};
