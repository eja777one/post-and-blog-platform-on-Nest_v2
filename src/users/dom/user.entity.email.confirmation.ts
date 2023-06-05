import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserEmailConfirmation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  expirationDate: string;

  @Column("boolean", { nullable: false, default: false })
  isConfirmed: boolean;

  @Column("uuid", { nullable: true })
  confirmationCode: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @OneToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  @JoinColumn()
  user: Users;
};