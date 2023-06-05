import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity()
export class UserBlogsBanInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("boolean", { nullable: false })
  isBanned: boolean;

  @Column("character varying", { nullable: false })
  banReason: string;

  @Column("character varying", { nullable: false })
  banDate: string;

  @Column("character varying", { nullable: false })
  blogId: string; // string? may be foreign key?

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  user: Users;
};