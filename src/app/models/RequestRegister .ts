export interface RequestRegister {
  success?: boolean;
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  error?: string;
  qrCodeUri?: string;
}
