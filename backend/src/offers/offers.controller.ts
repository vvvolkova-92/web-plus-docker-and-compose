import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  // 1. POST /offers СОЗДАТЬ ОФФЕР
  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(req.user, createOfferDto);
  }
  // 2. GET /offers получить все предложения
  @Get()
  async findAll() {
    const offers = await this.offersService.findAll();
    if (!offers) throw new NotFoundException("Предложения не найдены");
    return offers;
  }
  // 3. GET /offers/:id получить предложение по id
  @Get(":id")
  async findById(@Param("id") id: string) {
    const offer = await this.offersService.findById(+id);
    if (!offer)
      throw new NotFoundException(`Предложение с id ${id} не найдено`);
    return offer;
  }
}
