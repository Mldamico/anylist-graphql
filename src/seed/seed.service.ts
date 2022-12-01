import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.isProd) throw new UnauthorizedException('Cannot run seed on prod');

    await this.deleteDatabase();
    return true;
  }

  async deleteDatabase() {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }
}
