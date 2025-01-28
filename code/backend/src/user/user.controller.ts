import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const success = await this.userService.delete(id);
      if (!success) throw new NotFoundException('User not found');
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':id/verify-phone')
  async verifyPhone(@Param('id') id: string, @Body() body: { phoneNumber: string }) {
    try {
      return await this.userService.verifyPhone(id, body.phoneNumber);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string, @Body() body: { email: string }) {
    try {
      return await this.userService.verifyEmail(id, body.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/link-account')
  async linkAccount(
    @Param('id') id: string,
    @Body() body: { provider: 'google' | 'apple' | 'facebook'; accountData: Record<string, any> },
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userService.linkAccount(id, body.provider, body.accountData);
      return user;
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
