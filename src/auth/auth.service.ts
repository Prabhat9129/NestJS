import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './auth.entity';
import { UserRepository } from './auth.repository';
import { UserDto } from './dto/authCredintial.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayLoad } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(userDto: UserDto): Promise<Users> {
    return this.userRepository.addUser(userDto);
  }

  async signIn(userDto: UserDto): Promise<{ accessToken: string }> {
    const { username, password } = userDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: jwtPayLoad = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login credential');
    }
  }
}
