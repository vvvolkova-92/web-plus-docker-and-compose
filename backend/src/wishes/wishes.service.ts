import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { Repository } from "typeorm";
import { Wish } from "./entities/wish.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>
  ) {}
  // создание подарка
  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner });
    return this.wishRepository.save(wish);
  }
  // поиск всех
  findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }
  // поиск по id
  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException("Подарок не найден");
    }
    return wish;
  }
  // поиск массива значений
  async findWishList(item): Promise<Wish[]> {
    return await this.wishRepository.findBy(item);
  }
  //
  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findById(id);
    if (!wish) {
      throw new NotFoundException("Подарок не найден");
    }
    if (userId !== wish.owner.id)
      throw new ForbiddenException(
        "Нет доступа для редактирования этого подарка"
      );
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        "Вы не можете изменять стоимость подарка, если уже есть желающие скинуться"
      );
    }
    if (wish.copied > 0) {
      let isExist;
      const isCopied = await this.wishRepository.find({
        where: { owner: { id: userId } },
      });
      isCopied.length > 0 ? (isExist = true) : (isExist = false);
      if (isExist) {
        throw new ForbiddenException("Вы уже копировали себе этот подарок");
      }
    }
    return await this.wishRepository.update(id, {
      ...updateWishDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException("Подарок не найден");
    }
    if (userId !== wish.owner.id)
      throw new ForbiddenException("Нет доступа для удаления этого подарка");
    return await this.wishRepository.delete(id);
  }
  // поиск 40 последних подарков - в свагере непонятно, а в чек-листе стоит число 40
  async lastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: "DESC" },
    });
  }
  // поиск 10 топовых подарков - в свагере непонятно, а в чек-листе стоит число 10
  async topWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { copied: "DESC" },
    });
  }
  // скопировать подарок
  async copyWish(id: number, user: User) {
    const wish = await this.findById(id);
    console.dir(wish);
    if (!wish) {
      throw new NotFoundException("Подарок не найден");
    }
    if (user.id === wish.owner.id)
      throw new ForbiddenException("Нельзя копировать свои подарки");

    const { copied } = wish;
    //увеличить к-во копий
    await this.wishRepository.update(id, {
      copied: copied + 1,
    });
    // сделать копию
    await this.create(user, {
      ...wish,
      raised: 0,
    });
  }
}
