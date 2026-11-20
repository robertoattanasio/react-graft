export type GraftAuth<T = string> = {
  id: string;
  token: T | null;
  isAuthorized: boolean;
  onAuth: (token: T) => void;
  onAuthRevoke: () => void;
};

export type UseGraftAuthOptions<T = string> = {
  defaultValue?: T | null;
};
