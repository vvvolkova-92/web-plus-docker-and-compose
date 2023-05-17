import { Column, Entity, OneToMany } from "typeorm";
import { BaseClass } from "../../base/base-class";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";
//ОБРАТИТЕ ВНИМАНИЕ, ЧТО В СВАГЕРЕ И ЧЕК-ЛИСТЕ РАЗНЫЕ МИН И МАКС
@Entity()
// класс пользователя наследует базовый класс с общими значениями
export class User extends BaseClass {
  // колонка username
  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: "Имя пользователя слишком короткое, минимум 2 символа",
  })
  @MaxLength(30, {
    message: "Имя пользователя слишком длинное, максимум 30 символов",
  })
  username: string;
  // колонка about со значением по умолчанию
  @Column({
    default: "Пока ничего не рассказал о себе",
  })
  @IsString()
  @MinLength(2, {
    message: "Информации слишком мало, минимум 2 символа",
  })
  @MaxLength(200, {
    message: "Информации слишком много, максимум 30 символов",
  })
  about: string;

  // колонка avatar со значением по умолчанию
  @Column({
    default: "htts://i.pravatar.cc/300",
  })
  @IsUrl()
  avatar: string;

  // колонка email с уникальным значением
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  // колонка password с уникальным значением
  @Column()
  @IsString()
  password: string;
  // список желаемых подарков 1 ко многим
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
  // список подарков, на которые юзер уже скидывается 1 ко многим
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
