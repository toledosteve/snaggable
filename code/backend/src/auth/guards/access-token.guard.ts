import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Access token is missing');
        }

        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}
