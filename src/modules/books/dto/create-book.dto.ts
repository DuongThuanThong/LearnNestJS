// create-book.dto.ts
import {
  IsDateString,
  IsISBN,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @Length(1, 120)
  author!: string;

  @IsISBN()
  isbn!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
