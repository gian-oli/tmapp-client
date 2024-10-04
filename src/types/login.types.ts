export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponseType {
  token: string | undefined;
}

export interface Profile {
  id: number | string;
  username: string;
  email: string;
  role_id: number;
}
