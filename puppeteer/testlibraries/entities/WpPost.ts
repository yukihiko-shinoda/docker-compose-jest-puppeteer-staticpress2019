import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("post_name", ["postName"], {})
@Index("type_status_date", ["postType", "postStatus", "postDate", "id"], {})
@Index("post_parent", ["postParent"], {})
@Index("post_author", ["postAuthor"], {})
@Entity("wp_posts", { schema: "exampledb" })
export class WpPost {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ID", unsigned: true })
  id!: string;

  @Column("bigint", {
    name: "post_author",
    unsigned: true,
    default: () => "'0'",
  })
  postAuthor!: string;

  @Column("datetime", {
    name: "post_date",
    default: () => "'1000-01-01 00:00:00'",
  })
  postDate!: Date;

  @Column("datetime", {
    name: "post_date_gmt",
    default: () => "'1000-01-01 00:00:00'",
  })
  postDateGmt!: Date;

  @Column("longtext", { name: "post_content" })
  postContent!: string;

  @Column("text", { name: "post_title" })
  postTitle!: string;

  @Column("text", { name: "post_excerpt" })
  postExcerpt!: string;

  @Column("varchar", {
    name: "post_status",
    length: 20,
    default: () => "'publish'",
  })
  postStatus!: string;

  @Column("varchar", {
    name: "comment_status",
    length: 20,
    default: () => "'open'",
  })
  commentStatus!: string;

  @Column("varchar", {
    name: "ping_status",
    length: 20,
    default: () => "'open'",
  })
  pingStatus!: string;

  @Column("varchar", { name: "post_password", length: 255 })
  postPassword!: string;

  @Column("varchar", { name: "post_name", length: 200 })
  postName!: string;

  @Column("text", { name: "to_ping" })
  toPing!: string;

  @Column("text", { name: "pinged" })
  pinged!: string;

  @Column("datetime", {
    name: "post_modified",
    default: () => "'1000-01-01 00:00:00'",
  })
  postModified!: Date;

  @Column("datetime", {
    name: "post_modified_gmt",
    default: () => "'1000-01-01 00:00:00'",
  })
  postModifiedGmt!: Date;

  @Column("longtext", { name: "post_content_filtered" })
  postContentFiltered!: string;

  @Column("bigint", {
    name: "post_parent",
    unsigned: true,
    default: () => "'0'",
  })
  postParent!: string;

  @Column("varchar", { name: "guid", length: 255 })
  guid!: string;

  @Column("int", { name: "menu_order", default: () => "'0'" })
  menuOrder!: number;

  @Column("varchar", { name: "post_type", length: 20, default: () => "'post'" })
  postType!: string;

  @Column("varchar", { name: "post_mime_type", length: 100 })
  postMimeType!: string;

  @Column("bigint", { name: "comment_count", default: () => "'0'" })
  commentCount!: string;
}
