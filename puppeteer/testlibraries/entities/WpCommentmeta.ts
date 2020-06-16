import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("comment_id", ["commentId"], {})
@Index("meta_key", ["metaKey"], {})
@Entity("wp_commentmeta", { schema: "exampledb" })
export class WpCommentmeta {
  @PrimaryGeneratedColumn({ type: "bigint", name: "meta_id", unsigned: true })
  metaId!: string;

  @Column("bigint", {
    name: "comment_id",
    unsigned: true,
    default: () => "'0'",
  })
  commentId!: string;

  @Column("varchar", { name: "meta_key", nullable: true, length: 255 })
  metaKey!: string | null;

  @Column("longtext", { name: "meta_value", nullable: true })
  metaValue!: string | null;
}
