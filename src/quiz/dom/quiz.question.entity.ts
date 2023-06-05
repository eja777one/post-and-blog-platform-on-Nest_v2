import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// import { QuizAnswers } from "../../quiz/dom/quiz.answers.entity";

@Entity()
export class QuizQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  body: string;

  @Column("boolean", { nullable: false, default: false })
  published: boolean;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("character varying", { nullable: true })
  updatedAt: string;

  @Column("json", { nullable: false })
  correctAnswers: string;
};