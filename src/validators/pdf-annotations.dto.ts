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

import { AnnotationCreateDto } from "./annotations.dto";

export class PdfAnnotationCreateDto {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  created_by_id: string;

  @IsNotEmpty()
  @IsString()
  pdf_id: string;

  @IsNotEmpty()
  @IsString()
  class_id: string;

  // @IsNotEmpty()
  @IsString()
  teacher_id?: string;

  annotations: [AnnotationCreateDto];
}
