import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from '../users/entities/user.entity';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuards)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List)
  createList(
    @Args('createListInput') createListInput: CreateListInput,
    @currentUser() user: User,
  ) {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @currentUser() user: User,
    @Args() paginationargs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ) {
    return this.listsService.findAll(user, paginationargs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @currentUser() user: User,
  ) {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @currentUser() user: User,
  ) {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @Args('id', { type: () => ID }) id: string,
    @currentUser() user: User,
  ) {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'totalItemsByList' })
  async countListItemByList(@Parent() list: List): Promise<number> {
    return this.listItemService.countListItemsByList(list);
  }
}
