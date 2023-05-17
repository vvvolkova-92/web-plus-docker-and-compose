import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("wishes")
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  // 5. GET /wishes/last - в свагере непонятно, а в чек-листе 40 последних подарков
  @Get("last")
  async findLastWishes() {
    return await this.wishesService.lastWishes();
  }
  // 6. GET /wishes/top - в свагере непонятно, а в чек-листе 10 топ подарков
  @Get("top")
  async findTopWishes() {
    return await this.wishesService.topWishes();
  }
  // 1. POST /wishes - новый желаемый подарок
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }
  // 2. GET /wishes/:id - подарок по id
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.wishesService.findById(+id);
  }
  // todo для PATCH и DELETE реализовать проверку по ID!
  // 3. PATCH /wishes/:id - редактировать подарок по id
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateWishDto: UpdateWishDto
  ) {
    return await this.wishesService.update(+id, updateWishDto, +req.user.id);
  }
  // 4. DELETE /wishes/:id - удалить подарок по id
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Req() req, @Param("id") id: string) {
    return await this.wishesService.remove(+id, +req.user.id);
  }
  // 7. POST /wishes/:id/copy - копия подарка
  @UseGuards(JwtAuthGuard)
  @Post(":id/copy")
  async copyWish(@Req() req, @Param("id") id: string) {
    return await this.wishesService.copyWish(+id, req.user);
  }
}
