import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "./entities/offer.entity";
import { WishesService } from "../wishes/wishes.service";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService
  ) {}
  async create(user: User, createOfferDto: CreateOfferDto) {
    const wishId = createOfferDto.item;
    const wish = await this.wishesService.findById(wishId);
    if (!wish) {
      throw new NotFoundException("Подарок не найден");
    }
    if (user.id === wish.owner.id)
      throw new ForbiddenException(
        "Вы сами добавили это предложение и скидываться на него вы не можете"
      );
    const sum = +wish.raised + +createOfferDto.amount;
    if (sum > +wish.price) throw new ForbiddenException("Сумма слишком велика");
    await this.wishesService.update(
      wish.id,
      {
        raised: sum,
      },
      user.id
    );
    await this.offerRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findById(id: number) {
    return await this.offerRepository.findOneBy({ id });
  }
}
