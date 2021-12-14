import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Annotations } from "./Annotations";

@Entity("pdf_annotations", { schema: "public" })
export class PdfAnnotations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  pdf_id: string;

  @Column("uuid")
  created_by_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Annotations, (annotation) => annotation.pdf_annotations, {
    cascade: true,
  })
  annotations: Annotations[];
}
