import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseClass } from "../../base/base-class";
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wishlist extends BaseClass {
  // колонка name Wishlist
  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: "Название слишком короткое, минимум 1 символ",
  })
  @MaxLength(250, {
    message: "Название слишком длинное, максимум 250 символов",
  })
  name: string;

  // колонка description
  @Column({ nullable: true })
  @IsString()
  @MaxLength(1500, {
    message: "Описание слишком длинное, максимум 1500 символов",
  })
  description: string;

  // колонка image
  @Column()
  @IsUrl()
  image: string;
  // колонка (1 ко многим) содержит набор ссылок на подарки
  @OneToMany(() => Wish, (wish) => wish.wishlist)
  itemsId: Wish[];
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
