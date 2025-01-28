import { Controller, Post, Body, BadRequestException, HttpCode, UseInterceptors, UploadedFiles, UseGuards, Get } from '@nestjs/common';
import { RegistrationDto, SaveStepDto } from './dto/registration.dto';
import { RegistrationService } from './service/registration.service';
import { stepsRegistry } from './config/steps.config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { StartDto } from './dto/steps.dto';

@Controller('user/register')
@UseGuards(AccessTokenGuard)
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post()
    @HttpCode(200)
    async register(@Body() registerDto: SaveStepDto) {
        const { registrationId, step, data } = registerDto;

        const stepInfo = stepsRegistry[step];
        if (!stepInfo) {
            throw new BadRequestException(`Invalid step: ${step}`);
        }

        const StepDto = stepInfo.dto;
        if (!StepDto) {
            throw new BadRequestException(`No DTO defined for step: ${step}`);
        }

        if (step !== 'start' && !registrationId) {
            throw new BadRequestException('registrationId is required for this step.');
          }

        if (registerDto.step === 'photos') {
            throw new BadRequestException('Please use /upload-photos endpoint to upload photos.');
        }

        const transformedData = plainToInstance(StepDto, data);
        const validationErrors = await validate(transformedData, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (validationErrors.length > 0) {
            const formattedErrors = validationErrors.reduce((acc, err) => {
                acc[err.property] = Object.values(err.constraints || {});
                return acc;
            }, {} as Record<string, string[]>);

            throw new BadRequestException({
                message: `Validation failed for step "${step}"`,
                errors: formattedErrors,
            });
        }

        if (step === 'start') {
            try {
              const newRegistration = await this.registrationService.start(transformedData);
              return {
                message: 'Registration started successfully.',
                registrationId: newRegistration.registrationId,
              };
            } catch (error) {
              throw new BadRequestException(error.message);
            }
        }

        try {
            return await this.registrationService.register(registrationId, step, transformedData);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("upload-photos")
    @HttpCode(200)
    @UseInterceptors(FilesInterceptor("photos", 6, { limits: { fileSize: 5 * 1024 * 1024 }}))
    async uploadPhotos(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { registrationId: string }
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files were uploaded.');
        }

        if (!body.registrationId || typeof body.registrationId !== "string") {
            throw new BadRequestException('A valid Registration ID is required.');
        }

        try {
            const result = await this.registrationService.savePhotos(body.registrationId, files);
            return { message: 'Photos uploaded successfully.', ...result };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("complete")
    @HttpCode(200)
    async completeRegistration(@Body() registrationDto: RegistrationDto) {
        try {
            const registration = await this.registrationService.getState(registrationDto.registrationId);
    
            const requiredSteps = Object.keys(stepsRegistry).filter(
                (step) => stepsRegistry[step].isRequired
            );
    
            const registrationData = registration.registrationData;
    
            for (const stepKey of requiredSteps) {
                const stepInfo = stepsRegistry[stepKey];
    
                if (!stepInfo.dto) {
                    continue;
                }
    
                if (!registrationData[stepKey]) {
                    throw new BadRequestException(`Data for step "${stepKey}" is missing.`);
                }
    
                const dtoInstance = plainToInstance(stepInfo.dto, registrationData[stepKey]);
                const validationErrors = await validate(dtoInstance, {
                    whitelist: true,
                    forbidNonWhitelisted: true,
                });
    
                if (validationErrors.length > 0) {
                    const formattedErrors = validationErrors.reduce((acc, err) => {
                        acc[err.property] = Object.values(err.constraints || {});
                        return acc;
                    }, {} as Record<string, string[]>);
    
                    throw new BadRequestException({
                        message: `Validation failed for step "${stepKey}"`,
                        errors: formattedErrors,
                    });
                }
            }
    
            await this.registrationService.complete(registrationDto.registrationId);
    
            return { message: 'Registration completed successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("state")
    @HttpCode(200)
    async getRegistrationState(@Body() registrationDto: RegistrationDto) {
        try {
            const state = await this.registrationService.getState(registrationDto.registrationId);
            return { state };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
