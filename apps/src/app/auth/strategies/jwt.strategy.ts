import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../../user/user.schema';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { environment } from '../../../environments/environment';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) : any => {
          console.log(request.headers['x-csrf-token']);
          let data = request.headers['x-csrf-token'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      secretOrKey: environment.secretKey,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log(ExtractJwt.fromHeader('X-CSRF-TOKEN'));
    return this.authService.verifyPayload(payload);
  }
}
