import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  findProfile(@Req() req) {
    let user = req.user;
    return this.userService.findProfile(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
