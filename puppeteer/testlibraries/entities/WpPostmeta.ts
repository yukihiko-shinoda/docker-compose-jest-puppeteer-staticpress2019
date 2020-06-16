import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("post_id", ["postId"], {})
@Index("meta_key", ["metaKey"], {})
@Entity("wp_postmeta", { schema: "exampledb" })
export class WpPostmeta {
  @PrimaryGeneratedColumn({ type: "bigint", name: "meta_id", unsigned: true })
  metaId!: string;

  @Column("bigint", { name: "post_id", unsigned: true, default: () => "'0'" })
  postId!: string;

  @Column("varchar", { name: "meta_key", nullable: true, length: 255 })
  metaKey!: string | null;

  @Column("longtext", { name: "meta_value", nullable: true })
  metaValue!: string | null;
}
