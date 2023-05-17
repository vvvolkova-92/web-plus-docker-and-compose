import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local.guard";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller("/")
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signin(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.login(user);
  }
}
