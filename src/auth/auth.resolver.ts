import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignUpInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { JwtAuthGuards } from './guards/jwt-auth.guard';
import { currentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'sigup' })
  signup(@Args('signupInput') signupInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuards)
  revalidateToken(@currentUser() user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
