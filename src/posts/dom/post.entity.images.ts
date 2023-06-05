import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  type: string;

  @Column("character varying", { nullable: false })
  url: string;

  @Column("character varying", { nullable: false })
  eTag: string;

  @Column("integer", { nullable: false })
  width: number;

  @Column("integer", { nullable: false })
  height: number;

  @Column("integer", { nullable: false })
  fileSize: number;

  @Column("character varying", { nullable: false })
  addedAt: string;

  @ManyToOne(() => Post, (post) => post.id,
    { onDelete: "CASCADE" })
  post: Post;

  @Column("uuid", { nullable: false })
  postId: string;
};