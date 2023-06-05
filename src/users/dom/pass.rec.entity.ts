import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class PassRecovery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @Column("character varying", { nullable: false })
  passwordRecoveryCode: string;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("character varying", { nullable: false })
  expiredAt: string;
};