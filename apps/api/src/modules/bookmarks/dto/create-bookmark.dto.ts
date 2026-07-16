import { IsString, IsOptional, IsUrl, IsEnum, IsUUID } from 'class-validator';
import { BookmarkType } from '@prisma/client';

export class CreateBookmarkDto {
  @IsString()
  title!: string;

  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BookmarkType)
  @IsOptional()
  type?: BookmarkType;

  @IsString()
  @IsOptional()
  siteName?: string;

  @IsUrl()
  @IsOptional()
  faviconUrl?: string;

  @IsUUID()
  @IsOptional()
  folderId?: string;
}
