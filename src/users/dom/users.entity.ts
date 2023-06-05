import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserSentEmails } from "./user.entity.sent.emails";
import { UserEmailConfirmation } from "./user.entity.email.confirmation";
import { UserBlogsBanInfo } from "./user.entity.blogs.ban.info";
import { UserBanInfo } from "./user.entity.ban.info";
import { BlogOwnerInfo } from "../../blogs/dom/blog.entity.owner.info";
import { PostLikes } from "../../posts/dom/post.entity.likes";
import { Post } from "../../posts/dom/post.entity";
import { PassRecovery } from "./pass.rec.entity";
import { Device } from "../../security/dom/device.entity";
import { Comment } from "../../comments/dom/comment.entity";
import { CommentLikes } from "../../comments/dom/comment.entity.likes";
import { QuizPlayerProgress } from "../../quiz/dom/quiz.player.progress.entity";
import { QuizStatistic } from "../../quiz/dom/quiz.statistic.entity";

@Entity()
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("character varying", { nullable: false })
  login: string;

  @Column("character varying", { nullable: false })
  email: string;

  @Column("character varying", { nullable: false })
  passwordHash: string;

  @Column("character varying", { nullable: false })
  passwordSalt: string;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("character varying", { nullable: false })
  registrationIP: string;

  @OneToMany(() => UserSentEmails,
    (userSentEmails) => userSentEmails.user)
  userSentEmails: UserSentEmails[];

  @OneToMany(() => UserBlogsBanInfo,
    (userBlogsBanInfo) => userBlogsBanInfo.user)
  userBlogsBanInfo: UserBlogsBanInfo[];

  @OneToOne(() => UserEmailConfirmation,
    (userEmailConfirmation) => userEmailConfirmation.user)
  userEmailConfirmation: UserEmailConfirmation;

  @OneToOne(() => UserBanInfo,
    (userBanInfo) => userBanInfo.user)
  userBanInfo: UserBanInfo;

  @OneToMany(() => BlogOwnerInfo,
    (blogOwnerInfo) => blogOwnerInfo.user)
  blogOwnerInfo: BlogOwnerInfo[];

  @OneToMany(() => PostLikes,
    (postLikes) => postLikes.user)
  postLikes: PostLikes[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => PassRecovery,
    (passRecovery) => passRecovery.user)
  passRecovery: PassRecovery[];

  @OneToMany(() => Device,
    (device) => device.user)
  device: Device[];

  @OneToMany(() => QuizPlayerProgress,
    (quizPlayerProgress) => quizPlayerProgress.playerId)
  quizPlayerProgress: QuizPlayerProgress[];

  @OneToMany(() => QuizStatistic,
    (quizStatistic) => quizStatistic.playerId)
  quizStatistic: QuizStatistic[];

  @OneToMany(() => Comment,
    (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => CommentLikes,
    (commentLikes) => commentLikes.user)
  commentLikes: CommentLikes[];
};