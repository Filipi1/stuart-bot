import { Module } from '@nestjs/common';
import { MemeService } from './services/domain/meme/meme.service';
import { MemeRepository } from './repositories/meme.repository';
import { SupabaseMemeRepository } from './repositories/supabase-meme.repository';
import { MemeEmbedGetterService } from './services/domain/meme-embed-getter/meme-embed-getter.service';
import { MemeCreatorService } from './services/domain/meme-creator/meme-creator.service';
import { RandomMemeGetterService } from './services/domain/random-meme-getter/random-meme-getter.service';
import { DiscordModule } from '@discord-nestjs/core';
import { UndrawedMemesGetterService } from './services/domain/undrawed-memes-getter/undrawed-memes-getter.service';

@Module({
    imports: [
        DiscordModule.forFeature(),
    ],
    providers: [
        MemeService,
        {
            provide: MemeRepository,
            useClass: SupabaseMemeRepository
        },
        MemeEmbedGetterService,
        MemeCreatorService,
        RandomMemeGetterService,
        UndrawedMemesGetterService
    ],
    exports: [
        MemeService,
        MemeRepository,
        MemeEmbedGetterService,
        MemeCreatorService,
        RandomMemeGetterService,
        UndrawedMemesGetterService
    ]
})
export class MemeModule {}
