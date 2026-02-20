import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../models/auth.models";
import { environment } from "../../../env/enviroment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = environment.API_URL;
  private readonly TOKEN_KEY = "jwt_token";
  private readonly USER_KEY = "user";

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
          }
          if (response.usuario?.username) {
            localStorage.setItem(this.USER_KEY, response.usuario.username);
          }
        }),
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/signup`,
      userData,
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined;
  }
}
