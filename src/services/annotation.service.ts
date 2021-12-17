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

import { Annotations } from "../models/Annotations";

import { AnnotationCreateDto } from "../validators/annotations.dto";
import { PdfAnnotationCreateDto } from "../validators/pdf-annotations.dto";

import {
  generateTokens,
  encryptPassword,
  getPagination,
  getFromCache,
  setInCache,
  deleteFromCache,
  getAnnotationsFromCache,
  sendQueueMessage,
} from "../helpers";

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
      .innerJoin("annotation.pdf_annotations", "pdf_annotation")
      .where("pdf_annotation.pdf_id = :pdf_id", { pdf_id: queryParams.pdf_id })
      .getMany();
  }

  async create(body: PdfAnnotationCreateDto) {
    try {
      const { annotations, ...pdfAnnotation } = body;

      const cacheKey = `${pdfAnnotation.created_by_id}:${pdfAnnotation.pdf_id}`;
      const response = await getAnnotationsFromCache(cacheKey);

      const createdAt = new Date();

      const formattedAnnotations = {
        ...annotations[0],
        ...(pdfAnnotation?.id && { pdf_annotation_id: pdfAnnotation.id }),
      };
      if (!response) {
        await setInCache(cacheKey, {
          created_at: createdAt,
          created_by_id: pdfAnnotation.created_by_id,
          pdf_id: pdfAnnotation.pdf_id,
          annotations: [...response.annotations, formattedAnnotations],
        });

        return sendQueueMessage(
          pdfAnnotation.pdf_id,
          pdfAnnotation.created_by_id,
          formattedAnnotations
        );
      }

      const annotationsFiltered = response.annotations.filter(
        (annotation) => annotation.id !== formattedAnnotations.id
      );

      await setInCache(cacheKey, {
        created_at: createdAt,
        created_by_id: pdfAnnotation.created_by_id,
        pdf_id: pdfAnnotation.pdf_id,
        annotations: [...annotationsFiltered, formattedAnnotations],
      });

      return sendQueueMessage(
        pdfAnnotation.pdf_id,
        pdfAnnotation.created_by_id,
        formattedAnnotations
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async delete(params: { created_by_id: string; pdf_id: string; id: string }) {
    const { created_by_id, pdf_id, id } = params;

    try {
      const cacheKey = `${created_by_id}:${pdf_id}`;
      const { annotations, ...response } = await getAnnotationsFromCache(
        cacheKey
      );

      const newAnnotations = annotations.filter(
        (annotation: { id: string }) => annotation.id !== id
      );

      await setInCache(cacheKey, { ...response, annotations: newAnnotations });

      // adicionar fila?
      await this.annotationsRepository.delete({ annotation_id: id });

      return { message: "Deleted with success" };
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }

  async saveAnnotations(body: any, token?: string) {
    const { id, pdf_id, created_by_id, formattedAnnotations } = body;

    const { id: annotation_id, annotation } = JSON.parse(formattedAnnotations);

    const pdfAnnotationId = Number(id);

    if (!pdfAnnotationId && !pdfAnnotationId) {
      const createdPdfAnnotation = await this.pdfAnnotationsRepository.save({
        pdf_id,
        created_by_id,
        annotations: [{ annotation_id, annotation }],
      });

      return createdPdfAnnotation;
    }

    await this.annotationsRepository.update({ annotation_id }, { annotation });

    await this.pdfAnnotationsRepository.update(
      { id },
      { updated_at: new Date() }
    );
  }
}
