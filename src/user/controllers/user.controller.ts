import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  findProfile(
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    const user = req.user;
    return this.userService.findProfile(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    const user = req.user;
    return this.userService.remove(id, user.userId);
  }
}
