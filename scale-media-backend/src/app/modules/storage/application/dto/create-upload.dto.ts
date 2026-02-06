import { IsIn, IsString } from 'class-validator';
export class CreateUploadDto {
  @IsString()
  @IsIn(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])
  extension!: string;
}
