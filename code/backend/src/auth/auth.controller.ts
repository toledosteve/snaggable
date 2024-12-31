import { Controller, Post, Body, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import { ClientAuthService } from './client-auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly clientAuthService: ClientAuthService,
    ) {}

    @Post('login')
    async authenticate(@Body() authDto: AuthDto): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            await this.clientAuthService.authenticate(authDto.clientId, authDto.clientSecret);
            return await this.authService.generateAccessToken(authDto.clientId);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
        try {
            const accessToken = await this.authService.refreshToken(refreshTokenDto.refreshToken);
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('revoke')
    @UseGuards(AccessTokenGuard)
    async revoke(@Req() req: any): Promise<{ message: string }> {
        const token = req.headers.authorization?.split(' ')[1];
        await this.authService.revokeToken(token);
        return { message: 'Token revoked successfully' };
    }
}