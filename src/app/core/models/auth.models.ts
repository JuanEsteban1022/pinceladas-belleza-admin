export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  };
}
