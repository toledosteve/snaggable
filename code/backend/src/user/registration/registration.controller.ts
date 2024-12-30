import { Controller, Post, Body, BadRequestException, HttpCode } from '@nestjs/common';
import { CreateRegistrationDto, VerifyPhoneDto } from './dto/registration.dto';
import { RegistrationService } from './service/registration.service';

@Controller('user/register')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post("start")
    @HttpCode(200)
    async startRegistration(@Body() createRegistration: CreateRegistrationDto) {
        try {
            const registrationId = await this.registrationService.start(createRegistration.phoneNumber);
            return { registrationId, message: 'Registration started successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("verify")
    @HttpCode(200)
    async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto) {
        try {
            await this.registrationService.verifyPhone(
                verifyPhoneDto.registrationId,
                verifyPhoneDto.code
            );
            return { message: 'Phone number verified successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("save-step")
    @HttpCode(200)
    async saveStep(@Body() saveStepDto: any) {
        try {
            return await this.registrationService.saveStep(
                saveStepDto.registrationId,
                saveStepDto.step,
                saveStepDto.data
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("complete")
    @HttpCode(200)
    async completeRegistration(@Body() registrationId: string) {
        try {
            await this.registrationService.complete(registrationId);
            return { message: 'Registration completed successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
