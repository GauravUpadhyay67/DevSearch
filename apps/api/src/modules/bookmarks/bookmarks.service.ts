import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createBookmarkDto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        ...createBookmarkDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id, userId },
    });
    
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }
    
    return bookmark;
  }

  async update(id: string, userId: string, updateBookmarkDto: UpdateBookmarkDto) {
    // Verify existence and ownership
    await this.findOne(id, userId);

    return this.prisma.bookmark.update({
      where: { id },
      data: updateBookmarkDto,
    });
  }

  async remove(id: string, userId: string) {
    // Verify existence and ownership
    await this.findOne(id, userId);

    return this.prisma.bookmark.delete({
      where: { id },
    });
  }
}
