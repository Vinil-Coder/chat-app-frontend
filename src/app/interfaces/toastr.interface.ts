export type ToastrSource = 'HTTP' | 'GLOBAL' | 'MANUAL';

export enum ToastrType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Toastr {
  message: string;
  type: ToastrType;
  duration: number;
  show: boolean;
  source: ToastrSource;
}