import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/dom/users.entity";

@Entity()
export class QuizStatistic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  playerId: string;

  @Column("json", { nullable: false })
  gameIds: string;

  @Column("integer", { nullable: false, default: 0 })
  sumScore: number;

  @Column("float", { nullable: false, default: 0 })
  avgScores: number;

  @Column("integer", { nullable: false, default: 0 })
  gamesCount: number;

  @Column("integer", { nullable: false, default: 0 })
  winsCount: number;

  @Column("integer", { nullable: false, default: 0 })
  lossesCount: number;

  @Column("integer", { nullable: false, default: 0 })
  drawsCount: number;

  @ManyToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  user: Users;
};