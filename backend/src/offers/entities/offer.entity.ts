import { Column, Entity, ManyToOne } from "typeorm";
import { BaseClass } from "../../base/base-class";
import { User } from "../../users/entities/user.entity";
import { Wish } from "../../wishes/entities/wish.entity";
import { IsBoolean, IsNumber } from "class-validator";

@Entity()
export class Offer extends BaseClass {
  // колонка amount - сумма заявки, чи сло до двух знаков после запятой
  @Column()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  amount: number;
  // колонка hidden - флаг, по умолчанию false
  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
  // колонка (многие к 1) на юзера, который желает скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  // колонка (многие к 1) ссылка на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
