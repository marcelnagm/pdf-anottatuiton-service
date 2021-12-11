import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PdfAnnotations } from "./PdfAnnotations";

@Entity("annotations", { schema: "public" })
export class Annotations {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying")
  annotation: string;

  @Column("integer")
  pdf_annotation_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => PdfAnnotations,
    (pdfAnnotations) => pdfAnnotations.annotations,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "pdf_annotation_id", referencedColumnName: "id" }])
  pdfAnnotations: PdfAnnotations;
}
