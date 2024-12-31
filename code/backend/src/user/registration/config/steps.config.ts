import { NameDto, DobDto, GenderDto, ShowGenderDto, PhotosDto, LocationDto, PledgeDto } from "../dto/steps.dto";

export const stepsOrder = ['name', 'dob', 'gender', 'showGender', 'photos', 'location', 'pledge'];

export const stepsRegistry = {
    name: NameDto,
    dob: DobDto,
    gender: GenderDto,
    showGender: ShowGenderDto,
    photos: PhotosDto,
    location: LocationDto,
    pledge: PledgeDto
}