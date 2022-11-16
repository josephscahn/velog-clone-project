import { IsString, IsNumber, IsNotEmpty, Max, Min } from "class-validator";

export class CreateBoard {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  status: number

  @IsString()
  thumbnail: string;
}