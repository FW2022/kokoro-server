import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class EmailVerification {
    @PrimaryColumn()
    id: string;

    @Column()
    expiredAt: Date = new Date(new Date().getTime() + 3 * 60 * 1000);

    @Column()
    code: string;

    get isExpired() {
        return new Date() > this.expiredAt;
    }

    constructor(userID: string) {
        this.id = userID;
    }
}
