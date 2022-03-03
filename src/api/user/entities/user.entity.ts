import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

const Role = {
    EmailVerified: "EmailVerified",
    Admin: "Admin",
} as const;
export type Role = typeof Role[keyof typeof Role];

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column("simple-array")
    roles: Role[] = [];

    @ManyToMany((type) => User, (user) => user.following)
    follower: User[];

    @ManyToMany((type) => User, (user) => user.follower)
    @JoinTable()
    following: User[];
}
