import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("option_name", ["optionName"], { unique: true })
@Index("autoload", ["autoload"], {})
@Entity("wp_options", { schema: "exampledb" })
export class WpOption {
  @PrimaryGeneratedColumn({ type: "bigint", name: "option_id", unsigned: true })
  optionId!: string;

  @Column("varchar", { name: "option_name", unique: true, length: 191 })
  optionName!: string;

  @Column("longtext", { name: "option_value" })
  optionValue!: string;

  @Column("varchar", { name: "autoload", length: 20, default: () => "'yes'" })
  autoload!: string;
}
