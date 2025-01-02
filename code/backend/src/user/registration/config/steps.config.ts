import { NameDto, DobDto, GenderDto, ShowGenderDto, PhotosDto, LocationDto, PledgeDto } from "../dto/steps.dto";

export const stepsOrder = [
    "start",
    "confirm_phone",
    "name",
    "dob",
    "gender",
    "show_gender",
    "photos",
    "location",
    "pledge"
];

export const stepsRegistry = {
    start: {
        description: "Start registration process",
        isRequired: true,
        dto: null, 
    },
    "confirm_phone": {
        description: "Verify phone number via OTP",
        isRequired: true,
        dto: null, 
    },
    name: {
        description: "Enter user name",
        isRequired: true,
        dto: NameDto,
    },
    dob: {
        description: "Enter date of birth",
        isRequired: true,
        dto: DobDto,
    },
    gender: {
        description: "Specify gender",
        isRequired: true,
        dto: GenderDto,
    },
    "show_gender": {
        description: "Specify gender display preference",
        isRequired: true,
        dto: ShowGenderDto,
    },
    photos: {
        description: "Upload photos",
        isRequired: true,
        dto: PhotosDto,
    },
    location: {
        description: "Provide location details",
        isRequired: true,
        dto: LocationDto,
    },
    pledge: {
        description: "Accept pledge",
        isRequired: true,
        dto: PledgeDto,
    },
}