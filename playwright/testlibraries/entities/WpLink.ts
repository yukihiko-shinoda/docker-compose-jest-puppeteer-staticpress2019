import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("link_visible", ["linkVisible"], {})
@Entity("wp_links", { schema: "exampledb" })
export class WpLink {
  @PrimaryGeneratedColumn({ type: "bigint", name: "link_id", unsigned: true })
  linkId!: string;

  @Column("varchar", { name: "link_url", length: 255 })
  linkUrl!: string;

  @Column("varchar", { name: "link_name", length: 255 })
  linkName!: string;

  @Column("varchar", { name: "link_image", length: 255 })
  linkImage!: string;

  @Column("varchar", { name: "link_target", length: 25 })
  linkTarget!: string;

  @Column("varchar", { name: "link_description", length: 255 })
  linkDescription!: string;

  @Column("varchar", { name: "link_visible", length: 20, default: () => "'Y'" })
  linkVisible!: string;

  @Column("bigint", {
    name: "link_owner",
    unsigned: true,
    default: () => "'1'",
  })
  linkOwner!: string;

  @Column("int", { name: "link_rating", default: () => "'0'" })
  linkRating!: number;

  @Column("datetime", {
    name: "link_updated",
    default: () => "'1000-01-01 00:00:00'",
  })
  linkUpdated!: Date;

  @Column("varchar", { name: "link_rel", length: 255 })
  linkRel!: string;

  @Column("mediumtext", { name: "link_notes" })
  linkNotes!: string;

  @Column("varchar", { name: "link_rss", length: 255 })
  linkRss!: string;
}
