import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserSentEmails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  sentDate: string;

  @Column("uuid", { nullable: false })
  confirmId: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  user: Users;
};