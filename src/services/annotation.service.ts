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
import {
  generateTokens,
  encryptPassword,
  getPagination,
  processOrderBy,
} from "../helpers";
import { Console } from "console";

@Injectable()
export class AnnotationService {
  constructor(
    @InjectRepository(Annotations)
    private annotationsRepository: Repository<Annotations>
  ) {}

  async index(queryParams: any) {
    const builder = this.annotationsRepository
      .createQueryBuilder("annotation")
      .innerJoin("annotation.pdfAnnotations", "pdf")
      .where("pdf.pdf_id = :pdf_id", { pdf_id: queryParams.pdf_id })
      .getMany();

    return builder;
  }
}
