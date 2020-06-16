import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("term_id", ["termId"], {})
@Index("meta_key", ["metaKey"], {})
@Entity("wp_termmeta", { schema: "exampledb" })
export class WpTermmeta {
  @PrimaryGeneratedColumn({ type: "bigint", name: "meta_id", unsigned: true })
  metaId!: string;

  @Column("bigint", { name: "term_id", unsigned: true, default: () => "'0'" })
  termId!: string;

  @Column("varchar", { name: "meta_key", nullable: true, length: 255 })
  metaKey!: string | null;

  @Column("longtext", { name: "meta_value", nullable: true })
  metaValue!: string | null;
}
