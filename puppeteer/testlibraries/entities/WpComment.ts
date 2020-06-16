import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("comment_post_ID", ["commentPostId"], {})
@Index("comment_approved_date_gmt", ["commentApproved", "commentDateGmt"], {})
@Index("comment_date_gmt", ["commentDateGmt"], {})
@Index("comment_parent", ["commentParent"], {})
@Index("comment_author_email", ["commentAuthorEmail"], {})
@Entity("wp_comments", { schema: "exampledb" })
export class WpComment {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "comment_ID",
    unsigned: true,
  })
  commentId!: string;

  @Column("bigint", {
    name: "comment_post_ID",
    unsigned: true,
    default: () => "'0'",
  })
  commentPostId!: string;

  @Column("tinytext", { name: "comment_author" })
  commentAuthor!: string;

  @Column("varchar", { name: "comment_author_email", length: 100 })
  commentAuthorEmail!: string;

  @Column("varchar", { name: "comment_author_url", length: 200 })
  commentAuthorUrl!: string;

  @Column("varchar", { name: "comment_author_IP", length: 100 })
  commentAuthorIp!: string;

  @Column("datetime", {
    name: "comment_date",
    default: () => "'1000-01-01 00:00:00'",
  })
  commentDate!: Date;

  @Column("datetime", {
    name: "comment_date_gmt",
    default: () => "'1000-01-01 00:00:00'",
  })
  commentDateGmt!: Date;

  @Column("text", { name: "comment_content" })
  commentContent!: string;

  @Column("int", { name: "comment_karma", default: () => "'0'" })
  commentKarma!: number;

  @Column("varchar", {
    name: "comment_approved",
    length: 20,
    default: () => "'1'",
  })
  commentApproved!: string;

  @Column("varchar", { name: "comment_agent", length: 255 })
  commentAgent!: string;

  @Column("varchar", { name: "comment_type", length: 20 })
  commentType!: string;

  @Column("bigint", {
    name: "comment_parent",
    unsigned: true,
    default: () => "'0'",
  })
  commentParent!: string;

  @Column("bigint", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId!: string;
}
