import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/dom/users.entity";
import { Post } from "../../posts/dom/post.entity";
import { CommentLikes } from "./comment.entity.likes";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  content: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("uuid", { nullable: false })
  postId: string;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;

  @Column("integer", { nullable: false, default: 0 })
  likesCount: number;

  @Column("integer", { nullable: false, default: 0 })
  dislikesCount: number;

  @Column("boolean", { nullable: false, default: false })
  isHide: boolean;

  @OneToMany(() => CommentLikes,
    (commentLikes) => commentLikes.comment)
  commentLikes: CommentLikes[];
};