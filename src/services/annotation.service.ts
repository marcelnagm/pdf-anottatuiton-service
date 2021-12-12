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
export class AnnotationService {
  constructor(
    @InjectRepository(Annotations)
    private annotationsRepository: Repository<Annotations>,

    @InjectRepository(PdfAnnotations)
    private pdfAnnotationsRepository: Repository<PdfAnnotations>
  ) {}
  async index(queryParams: { pdf_id: string }) {
    return this.annotationsRepository
      .createQueryBuilder("annotation")
      .innerJoin("annotation.pdfAnnotations", "pdf")
      .where("pdf.pdf_id = :pdf_id", { pdf_id: queryParams.pdf_id })
      .getMany();
  }

  async create(body: PdfAnnotationCreateDto) {
    try {
      const { annotations, ...pdfAnnotation } = body;

      // const pdfAnnotationCreated = await this.pdfAnnotationsRepository.upsert(
      //   pdfAnnotation,
      //   ["id"]
      // );

      // const [generatedMaps] = pdfAnnotationCreated.generatedMaps;

      // await this.annotationsRepository.upsert(
      //   body.annotations.map((annotation) => ({
      //     ...annotation,
      //     pdf_annotation_id: generatedMaps?.id,
      //   })),
      //   ["id"]
      // );

      return this.annotationsRepository.find({
        pdf_annotation_id: "a197badc-4183-43c6-a9ef-70199a16c84d",
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
