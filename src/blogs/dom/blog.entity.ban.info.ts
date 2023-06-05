import {
  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Blog } from "./blog.entity";

@Entity()
export class BlogBanInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("boolean", { nullable: false, default: false })
  isBanned: boolean;

  @Column("character varying", { nullable: true})
  banDate: string;

  @OneToOne(() => Blog, (blog) => blog.id,
    { onDelete: "CASCADE" })
  @JoinColumn()
  blog: Blog;

  @Column("uuid", { nullable: false })
  blogId: string;
};