import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';

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
}
