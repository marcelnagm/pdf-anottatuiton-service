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

import { Console } from "console";
import { PdfAnnotations } from "../models/PdfAnnotations";

import { getFromCache, setInCache, deleteFromCache } from "../helpers";

@Injectable()
export class PdfAnnotationService {
  constructor(
    @InjectRepository(PdfAnnotations)
    private pdfAnnotationsRepository: Repository<PdfAnnotations>
  ) {}

  async index(queryParams: { pdf_id: string; created_by_id: string }) {
    const cacheKey = `${queryParams.created_by_id}:${queryParams.pdf_id}`;

    const response = await getFromCache(cacheKey);

    return this.pdfAnnotationsRepository.find({
      relations: ["annotations"],
      where: {
        created_by_id: queryParams.created_by_id,
        pdf_id: queryParams.pdf_id,
      },
    });
  }
}
