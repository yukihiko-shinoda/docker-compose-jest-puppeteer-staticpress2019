import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("term_id_taxonomy", ["termId", "taxonomy"], { unique: true })
@Index("taxonomy", ["taxonomy"], {})
@Entity("wp_term_taxonomy", { schema: "exampledb" })
export class WpTermTaxonomy {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "term_taxonomy_id",
    unsigned: true,
  })
  termTaxonomyId!: string;

  @Column("bigint", { name: "term_id", unsigned: true, default: () => "'0'" })
  termId!: string;

  @Column("varchar", { name: "taxonomy", length: 32 })
  taxonomy!: string;

  @Column("longtext", { name: "description" })
  description!: string;

  @Column("bigint", { name: "parent", unsigned: true, default: () => "'0'" })
  parent!: string;

  @Column("bigint", { name: "count", default: () => "'0'" })
  count!: string;
}
