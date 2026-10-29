import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
