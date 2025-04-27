import { IsString } from 'class-validator';

export class ListAudiosDTO {
    @IsString()
    readonly nome: string;
} 