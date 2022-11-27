import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsPositive()
  @IsNumber()
  quantity: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  quantityUnits?: string;
}
