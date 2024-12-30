import { Controller, Post, Body } from '@nestjs/common';
import { SendVerificationDto, ValidateCodeDto } from './dto/verification.dto';
import { RegistrationService } from './service/registration.service';

@Controller('registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post('verify')
    async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
        const verificationId = await this.registrationService.sendVerification(
            sendVerificationDto.phoneNumber,
        );
        return { verificationId };
    }

    @Post('validate')
    async validateCode(@Body() validateCodeDto: ValidateCodeDto) {
        await this.registrationService.validateCode(
            validateCodeDto.phoneNumber,
            validateCodeDto.verificationId,
            validateCodeDto.code,
          );
          return { message: 'Verification successful.' };
    }
}
