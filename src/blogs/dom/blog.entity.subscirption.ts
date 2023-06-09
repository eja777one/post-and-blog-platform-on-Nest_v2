import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn }
  from "typeorm";
import { Blog } from "./blog.entity";
import { Users } from "../../users/dom/users.entity";

@Entity()
export class BlogSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Blog, (blog) => blog.id,
    { onDelete: "CASCADE" })
  blog: Blog;

  @Column("uuid", { nullable: false })
  blogId: string;

  @OneToMany(() => Users, (user) => user.id)
  user: Users;

  @Column("uuid", { nullable: false })
  userId: string;

  @Column("uuid", { nullable: false })
  secret: string;

  @Column("character varying", { nullable: true })
  telegramId: string;
};