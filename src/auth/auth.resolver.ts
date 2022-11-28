import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'sigup' })
  signup(@Args('signupInput') signupInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  // @Mutation( , {name: 'login'})
  // login(): Promise<>{
  //   return this.authService.login()
  // }

  // @Query(, {name: 'revalidate'})
  // revalidateToken() {
  //   return this.authService.revalidateToken()
  // }
}
