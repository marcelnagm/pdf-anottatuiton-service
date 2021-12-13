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
  @IsString()
  id?: string;

  @IsNotEmpty()
  annotation: string;

  @IsString()
  pdf_annotation_id: string;

  @IsString()
  created_at?: Date;

  @IsString()
  updated_at?: Date;

  pdf_annotations: [];
}
