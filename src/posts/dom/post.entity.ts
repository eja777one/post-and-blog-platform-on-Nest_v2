import {
  Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../../users/dom/users.entity";
import { Blog } from "../../blogs/dom/blog.entity";
import { PostLikes } from "./post.entity.likes";
import { Comment } from "../../comments/dom/comment.entity";
import { PostImage } from "./post.entity.images";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @Column("character varying", { nullable: false })
  title: string;

  @Column("character varying", { nullable: false })
  shortDescription: string;

  @Column("character varying", { nullable: false })
  content: string;

  @Column("uuid", { nullable: false })
  blogId: string;

  @ManyToOne(() => Blog, (blog) => blog.id,
    { onDelete: "CASCADE" })
  blog: Blog;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("integer", { nullable: false, default: 0 })
  dislikesCount: number;

  @Column("boolean", { nullable: false, default: false })
  isHide: boolean;

  @Column("integer", { nullable: false, default: 0 })
  likesCount: number;

  @OneToMany(() => PostLikes,
    (postLikes) => postLikes.post)
  postLikes: PostLikes[];

  @OneToMany(() => Comment,
    (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => PostImage,
    (postImage) => postImage.post)
  postImage: PostImage[];
};