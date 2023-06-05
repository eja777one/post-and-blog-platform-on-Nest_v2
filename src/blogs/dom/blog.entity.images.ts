import {
  Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Blog } from "./blog.entity";

@Entity()
export class BlogImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false})
  type: string;

  @Column("character varying", { nullable: false})
  url: string;

  @Column("character varying", { nullable: false})
  eTag: string;

  @Column("integer", { nullable: false})
  width: number;

  @Column("integer", { nullable: false})
  height: number;

  @Column("integer", { nullable: false})
  fileSize: number;

  @Column("character varying", { nullable: false})
  addedAt: string;

  @ManyToOne(() => Blog, (blog) => blog.id,
    { onDelete: "CASCADE" })
  blog: Blog;

  @Column("uuid", { nullable: false })
  blogId: string;
};