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
  OneToMany,
} from "typeorm";
import { PdfAnnotations } from "./PdfAnnotations";

@Entity("annotations", { schema: "public" })
export class Annotations {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("text")
  annotation: string;

  @Column("varchar")
  pdf_annotation_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => PdfAnnotations, (pdf) => pdf.annotations)
  @JoinColumn({ name: "pdf_annotation_id", referencedColumnName: "id" })
  pdf_annotations: PdfAnnotations;
}
