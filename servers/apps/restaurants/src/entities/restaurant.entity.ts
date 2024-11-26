import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
