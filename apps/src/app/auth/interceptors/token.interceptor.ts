import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../user/user.schema';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<User>
  ): Observable<User> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.authService.signToken(user);

        response.setHeader('Authorization', `Bearer ${token}`);
        response.cookie('token', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: environment.production,
        });
        response.cookie('csrf_access_token', token, {
          httpOnly: false,
          signed: true,
          sameSite: 'strict',
          secure: environment.production,
        });
        return user;
      })
    );
  }
}
