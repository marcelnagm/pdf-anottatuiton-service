import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Init1624479473228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "pdf_annotations",
        columns: [
          {
            name: "id",
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "pdf_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_by_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );

    await queryRunner.createTable(
      new Table({
        name: "annotations",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "annotation",
            type: "text",
            isNullable: false,
          },
          {
            name: "pdf_annotation_id",
            type: "int4",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );

    await queryRunner.createForeignKey(
      "annotations",
      new TableForeignKey({
        columnNames: ["pdf_annotation_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "pdf_annotations",
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "logs",
        columns: [
          {
            name: "id",
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "level",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "message",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "meta",
            type: "json",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("annotations");
    await queryRunner.dropTable("pdf_annotations");
    await queryRunner.dropTable("logs");
  }
}
