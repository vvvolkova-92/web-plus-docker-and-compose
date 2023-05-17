import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Wish } from "../wishes/entities/wish.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // 1. GET users/me - просмотр своего профиля
  @Get("me")
  async findMe(@Req() req): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }
  // 2. PATCH users/me - изменение своего профиля
  @Patch("me")
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  // 3. GET users/me/wishes - все мои подарки
  @Get("me/wishes")
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.findUserWishes(req.user.id);
  }
  // 4. GET users/:username - найти юзера по юзернейму
  @Get(":username")
  async findByUsername(@Param("username") username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    return user;
  }
  // 5. GET users/:username/wishes - найти подарки по юзернейму
  @Get(":username/wishes")
  async findWishesByUsername(
    @Param("username") username: string
  ): Promise<Wish[]> {
    const { id } = await this.usersService.findByUsername(username);
    if (!id) throw new NotFoundException("Пользователь не найден");
    const wishes = await this.usersService.findUserWishes(id);
    return wishes;
  }

  // 6. POST users/find - найти юзера по почте
  @Post("find")
  async findByEmail(@Body() query: string): Promise<User[]> {
    const user = await this.usersService.findByEmail(query);
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }
  @Get(":id")
  findBy(@Param("id") id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
