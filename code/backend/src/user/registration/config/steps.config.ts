import { NameDto, DobDto, GenderDto, PhotosDto } from "../dto/steps.dto";

export const stepsOrder = ['name', 'dob', 'gender', 'photos'];

export const stepsRegistry = {
    name: NameDto,
    dob: DobDto,
    gender: GenderDto,
    photos: PhotosDto
}