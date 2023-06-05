import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/dom/users.entity";
import { Post } from "./post.entity";

@Entity()
export class PostLikes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  postId: string;

  @Column("character varying", { nullable: false })
  addedAt: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @Column("character varying", { nullable: false })
  likeStatus: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;
};