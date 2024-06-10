import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeEntity } from './entities/meme.entity';
import { MemeService } from './services/domain/meme/meme.service';
import { MemeRepository } from './repositories/meme.repository';
import { MemeEmbedGetterService } from './services/domain/meme-embed-getter/meme-embed-getter.service';
import { MemeCreatorService } from './services/domain/meme-creator/meme-creator.service';
import { RandomMemeGetterService } from './services/domain/random-meme-getter/random-meme-getter.service';
import { DiscordModule } from '@discord-nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forFeature([MemeEntity]),
        DiscordModule.forFeature(),
    ],
    providers: [
        MemeService,
        MemeRepository,
        MemeEmbedGetterService,
        MemeCreatorService,
        RandomMemeGetterService
    ],
    exports: [
        MemeService,
        MemeRepository,
        MemeEmbedGetterService,
        MemeCreatorService,
        RandomMemeGetterService
    ]
})
export class MemeModule {}
