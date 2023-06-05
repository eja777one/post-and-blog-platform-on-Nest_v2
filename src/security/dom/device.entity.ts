import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/dom/users.entity";

@Entity()
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  userId: string;

  @ManyToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  user: Users;

  @Column("character varying", { nullable: false })
  createdAt: string;

  @Column("character varying", { nullable: false })
  expiredAt: string;

  @Column("character varying", { nullable: false })
  deviceId: string;

  @Column("character varying", { nullable: false })
  ip: string;

  @Column("character varying", { nullable: false })
  deviceName: string;
};