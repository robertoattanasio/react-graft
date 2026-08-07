export type GraftAlert<T = unknown> = {
  id: string;
  isActive: boolean;
  storage: T | null;
  open: (payload?: T | null) => Promise<boolean>;
  close: (result?: boolean) => void;
  onConfirm: () => void;
  onDismiss: () => void;
};
