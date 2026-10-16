import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../db/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { username, password } = dto;
    const existsUsername = await this.db.user.findUnique({
      where: { username: username },
    });
    if (existsUsername) {
      throw new RpcException({
        statusCode: 409,
        message: 'Username already exists',
      });
    }
    const hashedPass = await hash(password, 7);
    const user = await this.db.user.create({
      data: { ...dto, password: hashedPass },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async findAll() {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!users) {
      throw new RpcException({
        statusCode: 404,
        message: 'There is no users yet',
      });
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    const existsUsername = await this.db.user.findUnique({
      where: { username: dto.username, NOT: { id } },
    });
    if (existsUsername) {
      throw new RpcException({
        statusCode: 409,
        message: 'Username already exists',
      });
    }

    return await this.db.user.update({ where: { id: id }, data: dto });
  }

  async remove(id: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    await this.db.user.delete({ where: { id: id } });
    return { message: 'User deleted successfully' };
  }
}
