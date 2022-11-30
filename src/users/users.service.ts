import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/inputs';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0)
      return this.usersRepository.find({
        relations: {
          lastUpdateBy: true,
        },
      });

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      this.handleDbErrors({
        code: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDbErrors({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = user;

    return await this.usersRepository.save(userToBlock);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.details.replace('Key ', ''));
    }
    if ((error.code = 'error-001')) {
      throw new BadRequestException(error.details.replace('Key ', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
