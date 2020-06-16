import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_id", ["userId"], {})
@Index("meta_key", ["metaKey"], {})
@Entity("wp_usermeta", { schema: "exampledb" })
export class WpUsermeta {
  @PrimaryGeneratedColumn({ type: "bigint", name: "umeta_id", unsigned: true })
  umetaId!: string;

  @Column("bigint", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId!: string;

  @Column("varchar", { name: "meta_key", nullable: true, length: 255 })
  metaKey!: string | null;

  @Column("longtext", { name: "meta_value", nullable: true })
  metaValue!: string | null;
}
