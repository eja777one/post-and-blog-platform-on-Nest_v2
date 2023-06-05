import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/dom/users.entity";
import { Comment } from "./comment.entity";

@Entity()
export class CommentLikes {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @Column("character varying", { nullable: false })
  likeStatus: string;

  @Column("uuid", { nullable: false })
  commentId: string;

  @ManyToOne(() => Comment,
    (comment) => comment.id, { onDelete: "CASCADE" })
  comment: Comment;

  @Column("character varying", { nullable: false })
  addedAt: string;
};