import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'createUser' }, dto),
    );
  }

  @Get('all')
  async findAll() {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'findAllUsers' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'findOneUser' }, { id }),
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'updateUser' }, { id, dto }),
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.userClient.send({ cmd: 'deleteUser' }, { id }),
    );
  }
}
