import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";

import { Annotations } from "../models/Annotations";

import {
  UserLoginDto,
  UserCreateDto,
  UserUpdateDto,
} from "../validators/user.dto";

import { AnnotationCreateDto } from "../validators/annotations.dto";
import { PdfAnnotationCreateDto } from "../validators/pdf-annotations.dto";

import {
  generateTokens,
  encryptPassword,
  getPagination,
  processOrderBy,
} from "../helpers";

import { Console } from "console";
import { PdfAnnotations } from "../models/PdfAnnotations";

@Injectable()
export class PdfAnnotationService {
  constructor(
    @InjectRepository(PdfAnnotations)
    private pdfAnnotationsRepository: Repository<PdfAnnotations>
  ) {}

  async index(queryParams: { pdf_id: string }) {
    return this.pdfAnnotationsRepository.find();
  }
}
