import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wish } from "../wishes/entities/wish.entity";
import * as bcrypt from "bcrypt";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>
  ) {}
  // создание пользователя
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    const isUsernameTaken = await this.findQuery(createUserDto.username);
    if (isUsernameTaken)
      throw new ForbiddenException(
        `Username ${createUserDto.username} занят, попробуйте другой`
      );
    const isEmailTaken = await this.findQuery(createUserDto.email);
    if (isEmailTaken)
      throw new ForbiddenException(
        `Пользователь с email ${createUserDto.email} уже зарегистрирован`
      );
    const { password, ...result } = user;
    const hashPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({ ...result, password: hashPassword });
  }
  // поиск всех пользователей
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // поиск пользователя по id
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`Пользователь с id ${id} не найден`);
    return user;
  }
  //поисе по почте и юзеру для проверки
  async findQuery(query): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    if (user.length > 0) {
      return user;
    } else return undefined;
  }
  // поиск пользователя по username
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user)
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`
      );
    return user;
  }
  // поиск пользователя по email? не понимаю запроса
  async findByEmail(query: string): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: query }],
    });
    if (!user)
      throw new NotFoundException(`Пользователь с email ${query} не найден`);
    return user;
  }
  // поиск подарков по пользователю
  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    if (!wishes) throw new NotFoundException(`Подарки не найдены`);
    return wishes;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;
    const isUsernameTaken = await this.findQuery(username);
    if (isUsernameTaken)
      throw new ForbiddenException(
        `Username ${username} занят, попробуйте другой`
      );
    const isEmailTaken = await this.findQuery(email);
    if (isEmailTaken)
      throw new ForbiddenException(
        `Пользователь с email ${email} уже зарегистрирован`
      );
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.update(id, {
        ...updateUserDto,
        password: hashPassword,
        updatedAt: new Date(),
      });
      return user;
    } else {
      return await this.userRepository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });
    }
  }

  async remove(id: number) {
    const user = await this.findById(id);
    await this.userRepository.delete(id);
  }
}
