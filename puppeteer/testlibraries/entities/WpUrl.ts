import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "wp_urls"})
export default class WpUrl {

    @PrimaryGeneratedColumn({name: 'ID'})
    id!: number;

    @Column()
    type!: string;

    @Column()
    url!: string;

    @Column()
    objectId!: number;

    @Column()
    objectType!: string;

    @Column()
    parent!: number;

    @Column()
    pages!: number;

    @Column()
    enable!: number;

    @Column()
    fileName!: string;

    @Column()
    fileDate!: Date;

    @Column()
    lastStatuscode!: number;

    @Column()
    lastModified!: Date;

    @Column()
    lastUpload!: Date;

    @Column()
    createDate!: Date;
}
