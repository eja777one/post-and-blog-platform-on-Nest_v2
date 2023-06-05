import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserBanInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("boolean", { nullable: false, default: false })
    // isBanned: string;
  isBanned: boolean;

  @Column("character varying", { nullable: true })
  banDate: string;

  @Column("character varying", { nullable: true })
  banReason: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @OneToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  @JoinColumn()
  user: Users;
};