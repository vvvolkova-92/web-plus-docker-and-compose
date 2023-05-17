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
import { WishlistsService } from "./wishlists.service";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
// ха ха, это шутка такая с таким путем????? словила баг на этом
@Controller("wishlistlists")
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  // 2. POST /wishlists - создать новый вишлист
  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return await this.wishlistsService.create(req.user, createWishlistDto);
  }
  // 1. GET /wishlists - получить все вишлисты
  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }
  // 3. GET /wishlists/:id - получить вишлист по id
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.wishlistsService.findById(+id);
  }
  // 4. PATCH /wishlists/:id - изменить вишлист по id
  @Patch(":id")
  async update(
    @Req() req,
    @Param("id") id: string,
    @Body() updateWishlistDto: UpdateWishlistDto
  ) {
    return await this.wishlistsService.update(req.user, +id, updateWishlistDto);
  }
  // 4. DELETE /wishlists/:id - удалить вишлист по id
  @Delete(":id")
  async remove(@Req() req, @Param("id") id: string) {
    return await this.wishlistsService.remove(+req.user.id, +id);
  }
}
