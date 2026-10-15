import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userClient;
    constructor(userClient: ClientProxy);
    create(dto: CreateUserDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(dto: UpdateUserDto): Promise<any>;
    delete(id: number): Promise<any>;
}
