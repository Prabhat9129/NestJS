import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtPayLoad } from './dto/jwt-payload.interface';
import { Users } from './auth.entity';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepogetory: UserRepository,
  ) {
    super({
      secretOrKey: 'prabhat1la',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: jwtPayLoad): Promise<Users> {
    const { username } = payload;
    const user: Users = await this.userRepogetory.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
