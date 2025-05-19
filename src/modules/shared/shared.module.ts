import { DiscordModule } from '@discord-nestjs/core';
import { Global, Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { MessageFromUserGuard } from '../bot/guards/message-from-user.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppEnvironment } from './enums/app-environment.enum';
import { SecretsProviders } from './providers/secrets.provider';
import { DropboxService } from './services/dropbox/dropbox.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './services/http-client/http-client.service';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerService } from './services/logger/logger.service';
import { SupabaseService } from './services/supabase/supabase.service';

@Global()
@Module({
    imports: [
        CacheModule.register(),
        HttpModule,
        DiscordModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                token: configService.get(AppEnvironment.BOT_TOKEN),
                discordClientOptions: {
                    intents: [
                        GatewayIntentBits.Guilds,
                        GatewayIntentBits.GuildMessages,
                        GatewayIntentBits.MessageContent,
                        GatewayIntentBits.GuildVoiceStates,
                        GatewayIntentBits.GuildMembers
                    ],
                    closeTimeout: 15000
                },
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [
        ...SecretsProviders,
        MessageFromUserGuard,
        DropboxService,
        HttpClientService,
        LoggerService,
        SupabaseService
    ],
    exports: [
        ...SecretsProviders,
        DropboxService,
        LoggerService,
        SupabaseService
    ]
})
export class SharedModule {}
