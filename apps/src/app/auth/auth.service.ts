import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(SignUpDto: SignUpDto): Promise<any> {
    const data = {
      ...SignUpDto,
      password: await this.hashPassword(SignUpDto.password),
    };
    const user = await this.userService.create(data);
    const token = this.signToken(user);
    return {
      msg: 'User successfully registered',
      success: true,
      email: user.email,
      token,
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
    if (!(await this.checkPassword(password, user.password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`
      );
    }
    const token = this.signToken(user);
    return {
      msg: 'User successfully login',
      success: true,
      email: user.email,
      token,
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
    return password;
  }

  async checkPassword(
    plainPassword: string,
    dbPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, dbPassword);
  }
}
