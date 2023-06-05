import {
  Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Blog } from "./blog.entity";
import { Users } from "../../users/dom/users.entity";

@Entity()
export class BlogOwnerInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Blog, (blog) => blog.id,
    { onDelete: "CASCADE" })
  @JoinColumn()
  blog: Blog;

  @Column("uuid", { nullable: true })
  blogId: string;

  @OneToMany(() => Users, (user) => user.id)
  user: Users;

  @Column("uuid", { nullable: true })
  userId: string;
};