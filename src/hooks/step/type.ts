export type GraftStep = {
  id: string;
  step: number;
  min: number;
  max: number;
  history: readonly number[];
  setStep: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export type UseGraftStepOptions = {
  defaultValue?: number;
  min?: number;
  max?: number;
};
