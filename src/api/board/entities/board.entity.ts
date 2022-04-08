import { Field, ObjectType } from "@nestjs/graphql";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Board {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @DeleteDateColumn()
    deletedAt: Date;

    @Field()
    @Column()
    authorID: string;

    @Field((type) => String, { nullable: true })
    @Column({ nullable: true })
    primaryColor: string;

    @Field((type) => String, { nullable: true })
    @Column({ nullable: true })
    secondaryColor: string;

    @Field((type) => String, { nullable: true })
    @Column({ nullable: true })
    therapeuticColor: string;

    @Field()
    @Column({ type: "text" })
    content: string;

    @Field((type) => [String])
    @Column({ type: "simple-array" })
    image: string[];

    @Field((type) => [String])
    @Column({ type: "simple-array" })
    hashtag: string[];
}
