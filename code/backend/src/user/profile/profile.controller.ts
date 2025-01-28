import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto/profile.dto';
import { plainToInstance } from 'class-transformer';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { validate } from 'class-validator';

@Controller('user/:id/profile')
@UseGuards(AccessTokenGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  async create(@Param('id') userId: string, @Body() createUserProfileDto: CreateUserProfileDto) {
    try {
      const dto = plainToInstance(CreateUserProfileDto, createUserProfileDto);
      const errors = await validate(dto);
      
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return await this.userProfileService.create(userId, createUserProfileDto);
    } catch (error) {
      if (error.message === 'User profile already exists') {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findByUserId(@Param('id') userId: string) {
    const profile = await this.userProfileService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  @Put()
  async update(@Param('id') userId: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    const profile = await this.userProfileService.update(userId, updateUserProfileDto);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  @Delete()
  async delete(@Param('id') userId: string) {
    const success = await this.userProfileService.delete(userId);
    if (!success) {
      throw new NotFoundException('User profile not found');
    }
    return { message: 'User profile deleted successfully' };
  }

  @Post('add-photo')
  async addPhoto(@Param('id') userId: string, @Body('photoUrl') photoUrl: string) {
    const profile = await this.userProfileService.addPhoto(userId, photoUrl);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  @Post('remove-photo')
  async removePhoto(@Param('id') userId: string, @Body('photoUrl') photoUrl: string) {
    const profile = await this.userProfileService.removePhoto(userId, photoUrl);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }
}
