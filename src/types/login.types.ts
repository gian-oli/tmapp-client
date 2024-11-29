export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponseType {
  token?: string;
  error?: any;
  message?: any,
  data?: any
}

export interface Profile {
  id: number | string;
  username: string;
  email: string;
  role_id: number;
}
