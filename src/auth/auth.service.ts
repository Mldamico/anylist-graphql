import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signup(signupInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = 'StandBy';

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('Auth failed');
    }
    return {
      token: 'Something',
      user,
    };
  }
}
