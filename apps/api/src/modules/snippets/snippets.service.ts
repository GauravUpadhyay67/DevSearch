import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createSnippetDto: CreateSnippetDto) {
    return this.prisma.snippet.create({
      data: {
        ...createSnippetDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.snippet.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const snippet = await this.prisma.snippet.findFirst({
      where: { id, userId },
    });
    
    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }
    
    return snippet;
  }

  async update(id: string, userId: string, updateSnippetDto: UpdateSnippetDto) {
    // Verify existence and ownership
    await this.findOne(id, userId);

    return this.prisma.snippet.update({
      where: { id },
      data: updateSnippetDto,
    });
  }

  async remove(id: string, userId: string) {
    // Verify existence and ownership
    await this.findOne(id, userId);

    return this.prisma.snippet.delete({
      where: { id },
    });
  }
}
