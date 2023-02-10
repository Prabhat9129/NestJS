import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from './auth.entity';
import { UserDto } from './dto/authCredintial.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<Users> {
  constructor(private datasource: DataSource) {
    super(Users, datasource.createEntityManager());
  }
  async addUser(userDto: UserDto): Promise<Users> {
    const { username, password } = userDto;
    console.log(username, password);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashPassword });
    try {
      return await this.save(user);
    } catch (err) {
      console.log(err.code);
      if (err.code === '23505') {
        throw new ConflictException('user is alredy exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
