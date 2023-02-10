import { Body, Controller, Post } from '@nestjs/common';
import { Users } from './auth.entity';
//import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from './dto/authCredintial.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() userDto: UserDto): Promise<Users> {
    return this.authService.signUp(userDto);
  }

  @Post('/signIn')
  signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(userDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@Req() req) {
  //   console.log(req);
  // }
}
