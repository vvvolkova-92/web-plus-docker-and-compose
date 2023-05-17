import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { WishesModule } from "./wishes/wishes.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { OffersModule } from "./offers/offers.module";
import { User } from "./users/entities/user.entity";
import { Offer } from "./offers/entities/offer.entity";
import { Wishlist } from "./wishlists/entities/wishlist.entity";
import { Wish } from "./wishes/entities/wish.entity";
import { AuthModule } from "./auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import * as process from "process";

const {
  POSTGRES_HOST = 'postgres',
  POSTGRES_PORT = 1111,
  POSTGRES_USER = 'usrm',
  POSTGRES_PASSWORD = 'pswd',
  POSTGRES_DB = 'kupipodariday',
} = process.env;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `../../.env`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: POSTGRES_HOST,
      port: +POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [User, Offer, Wish, Wishlist],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
