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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USERNAME || "student",
      password: process.env.POSTGRES_PASSWORD || "364758",
      database: process.env.POSTGRES_DATABASE || "kupipodariday",
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
