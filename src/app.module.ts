import { ConfigModule } from "@nestjs/config";

const configModule = ConfigModule.forRoot({
  envFilePath: [".env.local", ".env"]
});
import { TestsController } from "./test/test.controller";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { BlogsModule } from "./blogs/blogs.module";
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CommentsModule } from "./comments/comments.module";
import { SecurityModule } from "./security/security.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizModule } from "./quiz/quiz.module";
import { AvatarController } from "./avatar.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { TelegramAdapter } from "./adapters/telegram.adapter";
import { IntegrationsModule } from "./integrations/integrations.module";
// import { saveAvatarUseCase } from "./sava.avatar.uc";

export const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
if (!mongoUri) throw new Error("DB url does not found");

@Module({
  imports: [
    CqrsModule,
    configModule,
    MongooseModule.forRoot(mongoUri),
    // TypeOrmModule.forRoot({
    //     type: "postgres",
    //     host: "localhost",
    //     port: 5432,
    //     username: "nodejs",
    //     password: "nodejs",
    //     database: "BlogPlatform",
    //     autoLoadEntities: false,
    //     synchronize: false
    //   }
    // ),
    // TypeOrmModule.forRoot({
    //     type: "postgres",
    //     host: "kandula.db.elephantsql.com",
    //     port: 5432,
    //     username: "icetqrth",
    //     password: "2EhgHBuHwqaUWN7U8qu3ywN9vvoY97KB",
    //     database: "icetqrth",
    //     autoLoadEntities: true,
    //     synchronize: true
    //   }
    // ),
    TypeOrmModule.forRoot({
        type: "postgres",
        host: "kandula.db.elephantsql.com",
        port: 5432,
        username: "lvmzuidn",
        password: "qEGDtF1OoEqLaIDdOH7lOCkOELJzVvvl",
        database: "lvmzuidn",
        autoLoadEntities: true,
        synchronize: true
      }
    ),
    ThrottlerModule.forRoot({ ttl: 11, limit: 50 }), // limit should be 11 5
    BlogsModule,
    PostsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
    SecurityModule,
    QuizModule,
    IntegrationsModule
  ],
  controllers: [AppController, TestsController, AvatarController],
  providers: [AppService, /*saveAvatarUseCase,*/
    // { provide: FileStorageAdapter, useClass: S3StorageAdapter },
    { provide: APP_GUARD, useClass: ThrottlerGuard }, TelegramAdapter]
})
export class AppModule {
}