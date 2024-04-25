import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsOptional()
  @ValidateIf((o: SignInDto) => !o.username)
  email?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o: SignInDto) => !o.email)
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
