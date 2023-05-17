import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { Wishlist } from "./entities/wishlist.entity";
import { Repository } from "typeorm";
import { WishesService } from "../wishes/wishes.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class WishlistsService {
  private createWishlistDto: any;
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService
  ) {}
  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findWishList(
      createWishlistDto.itemsId
    );
    return await this.wishlistsRepository.save({
      ...createWishlistDto,
      owner: user,
      itemsId: wishes,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find();
  }

  async findById(id: number) {
    return await this.wishlistsRepository.findOneBy({ id });
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    // текущий вишлист
    const list = await this.findById(id);
    if (!list) {
      throw new NotFoundException("Вишлист не найден");
    }
    if (list.owner.id !== user.id)
      throw new ForbiddenException(
        "Нет доступа для редактирования этой записи"
      );
    const wishes = await this.wishesService.findWishList(
      updateWishlistDto.itemsId
    );
    const { name, image, description } = updateWishlistDto;
    return await this.wishlistsRepository.save({
      ...list,
      name,
      image,
      description,
      itemsId: wishes,
    });
  }

  async remove(userId: number, id: number) {
    const list = await this.findById(id);
    if (!list) {
      throw new NotFoundException("Вишлист не найден");
    }
    if (list.owner.id !== userId)
      throw new ForbiddenException("Нет доступа для удаления этой записи");

    return await this.wishlistsRepository.delete(id);
  }
}
