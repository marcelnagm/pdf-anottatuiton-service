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
  PrimaryColumn,
  Generated,
} from "typeorm";
import { PdfAnnotations } from "./PdfAnnotations";

@Entity("annotations", { schema: "public" })
export class Annotations {
  @PrimaryColumn({ type: "uuid", generated: "uuid" })
  annotation_id: string;

  @Column({ type: "integer" })
  @Generated("increment")
  id: number;

  @Column("text")
  annotation: string;

  @Column({ type: "integer" })
  pdf_annotation_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => PdfAnnotations, (pdf) => pdf.annotations)
  @JoinColumn({ name: "pdf_annotation_id", referencedColumnName: "id" })
  pdf_annotations: PdfAnnotations;
}
