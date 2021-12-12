import { Type } from "class-transformer";
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  isNumberString,
  IsNumberString,
  IsString,
} from "class-validator";

export class AnnotationCreateDto {
  @IsNotEmpty()
  annotation: string;
}
