import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  // @Field(() => Float)
  // @Column()
  // quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.items, { nullable: false })
  @Index('userId-index')
  user: User;
}
