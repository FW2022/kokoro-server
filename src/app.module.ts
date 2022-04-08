import { Module } from "@nestjs/common";
import { RenderModule } from "nest-next";
import Next from "next";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiModule } from "./api/api.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { User } from "./api/user/entities/user.entity";
import { EmailVerification } from "./api/auth/entities/EmailVerification.entity";
import { UserModule } from "./api/user/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { Board } from "./api/board/entities/board.entity";
import { BoardModule } from "./api/board/board.module";
import { Messenger } from "./api/messenger/entities/messenger.entity";
import { MessengerUser } from "./api/messenger/entities/messengerUser.entity";
import { MessengerText } from "./api/messenger/entities/messengerText.entity";
import { MessengerModule } from "./api/messenger/messenger.module";
import { BullModule } from "@nestjs/bull";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            isGlobal: true,
        }),
        RenderModule.forRootAsync(
            Next({
                dev:
                    // process.env.NODE_ENV !== "production"
                    true,
            })
        ),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            synchronize: true,
            charset: "utf8mb4_unicode_ci",
            entities: [
                User,
                EmailVerification,
                Board,
                Messenger,
                MessengerUser,
                MessengerText,
            ],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "..", "..", "public"),
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASS,
            },
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: async () => ({
                debug: !!process.env.GRAPHQL_DEBUG,
                playground: true,
                buildSchemaOptions: {
                    dateScalarMode: "isoDate",
                },
                cors: !!process.env.SERVER_CORS_ENABLE,
                introspection: !!process.env.GRAPHQL_INTROSPECTION,
                autoSchemaFile: join(process.cwd(), "src/schema.gql"),
                sortSchema: !!process.env.GRAPHQL_SORTSCHEMA,
                subscriptions: {
                    "graphql-ws": true,
                },
            }),
        }),
        ApiModule,
        UserModule,
        BoardModule,
        MessengerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    // constructor() {}
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(
    //         session({
    //             store: new TypeormStore({
    //                 cleanupLimit: 2,
    //                 limitSubquery: false, // If using MariaDB.
    //                 ttl: 86400,
    //             }).connect(repository),
    //             secret: "e5d7sF0h)Hgt7^RF5de",
    //         })
    //     );
    // }
}
