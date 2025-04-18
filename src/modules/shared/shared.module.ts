import { DiscordModule } from '@discord-nestjs/core';
import { Global, Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { MessageFromUserGuard } from '../bot/guards/message-from-user.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppEnvironment } from './enums/app-environment.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretsProviders } from './providers/secrets.provider';
import { TypeormConfigService } from './databases/services/typeormconfig/typeormconfig.service';
import { DropboxService } from './services/dropbox/dropbox.service';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './services/http-client/http-client.service';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerService } from './services/logger/logger.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeormConfigService,
        }),
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
        LoggerService
    ],
    exports: [
        ...SecretsProviders,
        DropboxService,
        LoggerService
    ]
})
export class SharedModule {}
