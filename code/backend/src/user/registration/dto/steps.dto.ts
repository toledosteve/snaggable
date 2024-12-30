import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString, Max, Min, IsIn } from "class-validator";

export class NameDto {
    @Expose()
    @IsString()
    name: string;
}

@Exclude()
export class DobDto {
    @Expose()
    @IsNumber()
    @Min(1, { message: "Day must be between 1 and 31" })
    @Max(31, { message: "Day must be between 1 and 31" })
    day: number;

    @Expose()
    @IsString({ message: "Month must be a string" })
    month: string;

    @Expose()
    @IsNumber()
    @Min(new Date().getFullYear() - 100, { message: "Year must be realistic" })
    @Max(new Date().getFullYear() - 18, { message: "You must be at least 18 years old" })
    year: number;
}

export class GenderDto {
    @Expose()
    @IsString()
    @IsIn(['Uncle', 'Auntie', '2 Spirit'])
    gender: string;
}   