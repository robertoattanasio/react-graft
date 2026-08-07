export type GraftDialog<T = unknown> = {
  id: string;
  isActive: boolean;
  storage: T | null;
  open: (payload?: T | null) => void;
  close: () => void;
};

export type UseGraftDialogOptions = {
  isActiveOnLoad?: boolean;
};
