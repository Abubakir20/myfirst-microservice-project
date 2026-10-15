import { IsNotEmpty, IsPhoneNumber, IsString} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}