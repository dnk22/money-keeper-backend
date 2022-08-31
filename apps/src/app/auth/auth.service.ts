import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUp } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(signUp: SignUp): Promise<any> {
    const data = {
      ...signUp,
      password: await this.hashPassword(signUp.password),
    };
    const user = await this.userService.create(data);
    return {
      msg: 'User successfully registered',
      success: true,
      email: user.email,
    };
  }

  async login(email: string, password: string): Promise<any> {
    let user: User;
    try {
      user = await this.userService.findOneByQuery({ email });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`
      );
    }
    // if (!(await this.checkPassword(password, user.password))) {
    //   throw new UnauthorizedException(
    //     `Wrong password for user with email: ${email}`
    //   );
    // }
    return {
      msg: 'User successfully login',
      success: true,
      email: user.email,
      id: user._id,
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;
    try {
      user = await this.userService.findOneByQuery({ email: payload.sub });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`
      );
    }
    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };
    return this.jwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2[abxy]?\$\d+\$/.test(password)) {
      password = await bcrypt.hash(password, salt);
    }
    return salt;
  }

  async checkPassword(
    plainPassword: string,
    dbPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, dbPassword);
  }
}
