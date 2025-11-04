import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_login_key", ["userLogin"], {})
@Index("user_nicename", ["userNicename"], {})
@Index("user_email", ["userEmail"], {})
@Entity("wp_users", { schema: "exampledb" })
export class WpUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ID", unsigned: true })
  id!: string;

  @Column("varchar", { name: "user_login", length: 60 })
  userLogin!: string;

  @Column("varchar", { name: "user_pass", length: 255 })
  userPass!: string;

  @Column("varchar", { name: "user_nicename", length: 50 })
  userNicename!: string;

  @Column("varchar", { name: "user_email", length: 100 })
  userEmail!: string;

  @Column("varchar", { name: "user_url", length: 100 })
  userUrl!: string;

  @Column("datetime", {
    name: "user_registered",
    default: () => "'1000-01-01 00:00:00'",
  })
  userRegistered!: Date;

  @Column("varchar", { name: "user_activation_key", length: 255 })
  userActivationKey!: string;

  @Column("int", { name: "user_status", default: () => "'0'" })
  userStatus!: number;

  @Column("varchar", { name: "display_name", length: 250 })
  displayName!: string;
}
