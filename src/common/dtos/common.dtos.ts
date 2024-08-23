import { Transform } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';

export class ListingRequestDto {
  @Transform(data => Number(data.value))
  @IsOptional()
  @Min(1)
  page: number;
  @Transform(data => Number(data.value))
  @IsOptional()
  limit: number;
  @IsString()
  @IsOptional()
  searchKey: string;
}

export class IdRequestDto {
  @IsString()
  id: string;
}
