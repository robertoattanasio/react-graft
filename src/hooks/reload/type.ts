export type GraftReload = {
  id: string;
  isReloading: boolean;
  onReload: () => void;
};

export type UseGraftReloadOptions = {
  delay?: number;
};
