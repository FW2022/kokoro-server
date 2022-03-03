import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BoardModule } from "./board/board.module";
import { MessengerModule } from './messenger/messenger.module';

@Module({
    imports: [AuthModule, UserModule, BoardModule, MessengerModule],
})
export class ApiModule {}
