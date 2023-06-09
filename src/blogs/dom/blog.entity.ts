import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlogOwnerInfo } from "./blog.entity.owner.info";
import { BlogBanInfo } from "./blog.entity.ban.info";
import { Post } from "../../posts/dom/post.entity";
import { BlogImage } from "./blog.entity.images";
import { BlogSubscription } from "./blog.entity.subscirption";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  name: string;

  @Column("character varying", { nullable: false })
  description: string;

  @Column("character varying", { nullable: false })
  websiteUrl: string;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("boolean", { nullable: false, default: false })
  isMembership: boolean;

  @OneToOne(() => BlogOwnerInfo,
    (blogOwnerInfo) => blogOwnerInfo.blog)
  blogOwnerInfo: BlogOwnerInfo;

  @OneToOne(() => BlogBanInfo,
    (blogBanInfo) => blogBanInfo.blog)
  blogBanInfo: BlogBanInfo;

  @OneToMany(() => Post, (post) => post.blog)
  post: Post[];

  @OneToMany(() => BlogImage,
    (blogImage) => blogImage.blog)
  blogImage: BlogImage[];

  @OneToMany(() => BlogSubscription,
    (blogSubscription) => blogSubscription.blog)
  blogSubscription: BlogSubscription[];
};