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

import { getFromCache, setInCache, getAnnotationsFromCache } from "../helpers";
import moment from "moment";

@Injectable()
export class PdfAnnotationService {
  constructor(
    @InjectRepository(PdfAnnotations)
    private pdfAnnotationsRepository: Repository<PdfAnnotations>
  ) {}

  async index(queryParams: { pdf_id: string; created_by_id: string }) {
    const cacheKey = `${queryParams.created_by_id}:${queryParams.pdf_id}`;

    const response = await getAnnotationsFromCache(cacheKey);

    const pdfAnnotations = await this.pdfAnnotationsRepository
      .createQueryBuilder("pdf_annotation")
      .innerJoinAndSelect("pdf_annotation.annotations", "annotation")
      .where("pdf_annotation.pdf_id = :pdf_id", { pdf_id: queryParams.pdf_id })
      .andWhere("pdf_annotation.created_by_id = :created_by_id", {
        created_by_id: queryParams.created_by_id,
      })
      .getOne();

    const pdfCreatedAtIsNewest = moment(
      pdfAnnotations?.updated_at
    ).isSameOrAfter(response.created_at);

    if (!pdfCreatedAtIsNewest) {
      return response;
    }

    return pdfAnnotations;
  }
}
