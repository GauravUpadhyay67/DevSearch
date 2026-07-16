import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  code!: string;

  @IsString()
  language!: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsUUID()
  @IsOptional()
  folderId?: string;
}
