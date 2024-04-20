import { Inject, Injectable, inject } from '@angular/core';
import { AppHttpService } from 'pc-core';
import { Observable, mergeMap, of } from 'rxjs';
import { Environment } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthProxy {

  private http = inject(AppHttpService);

  constructor(@Inject('environment') private environment: Environment) { }

  get path(): string {
    return `${this.environment.api}/api/v1/auth`;
  }

  register(fullName: string, email: string, password: string): Observable<AuthResponseDto> {
    const body = {
      fullName,
      email,
      password
    };

    return this.http.post(`${this.path}/register`, body).pipe(mergeMap((data: any) => of(new AuthResponseDto().fromJS(data))));
  }

  login(email: string, password: string): Observable<AuthResponseDto> {
    const body = {
      email,
      password
    };

    return this.http.post(`${this.path}/login`, body).pipe(mergeMap((data: any) => of(new AuthResponseDto().fromJS(data))));
  }

  updateInfo(fullName: string, email: string, phone: string): Observable<UserAuthResponseDto> {
    const url = `${this.path}/update-info`;
    const body = {
      fullName,
      email,
      phone
    };
    return this.http.update(url, body).pipe(mergeMap((data: any) => of(new UserAuthResponseDto().fromJS(data))));
  }

  getSession(): Observable<UserAuthResponseDto> {
    return this.http.get(`${this.path}/session`).pipe(mergeMap((data: any) => of(new UserAuthResponseDto().fromJS(data))));
  }

  refreshToken(refreshToken: string): Observable<AuthResponseDto> {
    const body = {
      refreshToken
    };

    return this.http.post(`${this.path}/refresh-token`, body).pipe(mergeMap((data: any) => of(new AuthResponseDto().fromJS(data))));
  }

  deleteAccount(): Observable<void> {
    const url = `${this.path}/delete-account`;
    return this.http.delete(url);
  }
}

export class AuthResponseDto {
  user!: UserAuthResponseDto;
  token!: string;
  refreshToken!: string;

  init(data: any): void {
    if (data) {
      this.user = data.user ? new UserAuthResponseDto().fromJS(data.user) : <any>undefined;
      this.token = data.token;
      this.refreshToken = data.refreshToken;
    }
  }

  fromJS(data: any): AuthResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new AuthResponseDto();
    result.init(data);
    return result;
  }
}

export class UserAuthResponseDto {
  fullName!: string;
  email!: string;
  phone!: string;
  id!: string;
  isActive!: string;
  role!: string;

  init(data: any): void {
    if (data) {
      this.fullName = data.fullName;
      this.email = data.email;
      this.phone = data.phone;
      this.id = data.id;
      this.isActive = data.isActive;
      this.role = data.role;
    }
  }

  fromJS(data: any): UserAuthResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new UserAuthResponseDto();
    result.init(data);
    return result;
  }
}