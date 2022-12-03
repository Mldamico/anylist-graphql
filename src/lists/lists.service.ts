import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User) {
    const newList = this.listRepository.create({ ...createListInput, user });

    await this.listRepository.save(newList);

    return newList;
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();

    // return this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: { user: { id: user.id }, name: Like(`%${search}%`) },
    // });
  }

  async findOne(id: string, user: User) {
    const list = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!list) throw new NotFoundException(`List with ${id} not found`);
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User) {
    const foundList = await this.findOne(id, user);
    const list = await this.listRepository.preload(updateListInput);
    if (!list) throw new NotFoundException(`List with ${id} not found`);
    return this.listRepository.save(list);
  }

  async remove(id: string, user: User) {
    const item = await this.findOne(id, user);

    await this.listRepository.remove(item);

    return { ...item, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
