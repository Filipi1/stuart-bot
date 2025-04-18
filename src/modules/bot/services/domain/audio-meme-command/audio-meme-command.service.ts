import { Injectable } from '@nestjs/common';
import { VoiceChannel, PermissionsBitField } from 'discord.js';
import { 
  joinVoiceChannel, 
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  StreamType,
  entersState,
  getVoiceConnection,
  generateDependencyReport,
  DiscordGatewayAdapterCreator,
  NoSubscriberBehavior
} from '@discordjs/voice';
import * as path from 'path';
import { createReadStream } from 'fs';

@Injectable()
export class AudioMemeCommandService {
  private readonly audioPath = path.join(process.cwd(), 'audios');

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private checkPermissions(voiceChannel: VoiceChannel): string[] {
    const missingPermissions: string[] = [];
    const requiredPermissions = [
      { flag: PermissionsBitField.Flags.ViewChannel, name: 'ViewChannel' },
      { flag: PermissionsBitField.Flags.Connect, name: 'Connect' },
      { flag: PermissionsBitField.Flags.Speak, name: 'Speak' },
      { flag: PermissionsBitField.Flags.Stream, name: 'Stream' }
    ];

    const botPermissions = voiceChannel.permissionsFor(voiceChannel.guild.members.me!);
    
    if (!botPermissions) {
      return ['Não foi possível verificar as permissões do bot'];
    }

    for (const { flag, name } of requiredPermissions) {
      if (!botPermissions.has(flag)) {
        missingPermissions.push(name);
      } else {
        console.log(`Bot tem permissão para ${name}`);
      }
    }

    return missingPermissions;
  }

  async playAudio(voiceChannel: VoiceChannel, audioName: string): Promise<void> {
    console.log('Iniciando playAudio...');
    console.log('Relatório de dependências:', generateDependencyReport());

    try {
      const missingPermissions = this.checkPermissions(voiceChannel);
      if (missingPermissions.length > 0) {
        throw new Error(`Permissões faltando: ${missingPermissions.join(', ')}`);
      }

      const existingConnection = getVoiceConnection(voiceChannel.guild.id);
      if (existingConnection) {
        console.log('Destruindo conexão existente...');
        existingConnection.destroy();
        await this.delay(2000);
      }

      if (!voiceChannel.joinable) {
        throw new Error('Canal não está disponível para conexão');
      }

      console.log('Tentando estabelecer conexão...');
      const adapterCreator = voiceChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator;
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      // Adiciona listeners para todos os estados
      connection.on(VoiceConnectionStatus.Signalling, () => {
        console.log('Status: Signalling');
      });

      connection.on(VoiceConnectionStatus.Connecting, () => {
        console.log('Status: Connecting');
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Status: Ready');
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        console.log('Status: Disconnected');
      });

      // Tenta entrar no estado Ready
      try {
        console.log('Aguardando estado Ready...');
        await entersState(connection, VoiceConnectionStatus.Ready, 60_000);
        console.log('Conexão estabelecida com sucesso!');
      } catch (error) {
        console.error('Erro ao aguardar estado Ready:', error);
        connection.destroy();
        throw error;
      }

      // Cria o player de áudio
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      // Conecta o player à conexão
      const subscription = connection.subscribe(player);
      if (!subscription) {
        throw new Error("Falha ao conectar o player à conexão de voz");
      }

      // Cria o recurso de áudio
      const audioFile = path.join(this.audioPath, `${audioName}.ogg`);
      console.log(`Carregando arquivo de áudio: ${audioFile}`);
      
      const stream = createReadStream(audioFile);
      const resource = createAudioResource(stream, {
        inputType: StreamType.OggOpus,
        inlineVolume: true,
        metadata: {
          title: audioName,
        }
      });
      
      // Ajusta o volume
      resource.volume.setVolume(1.0);
      console.log('Volume ajustado para 100%');
      
      // Adiciona listeners para o player
      player.on(AudioPlayerStatus.Idle, () => {
        console.log('Player está ocioso (Idle)');
        connection.destroy();
      });
      
      player.on(AudioPlayerStatus.Playing, () => {
        console.log('Player está tocando o áudio!');
      });

      player.on(AudioPlayerStatus.Buffering, () => {
        console.log('Player está bufferizando...');
      });
      
      player.on(AudioPlayerStatus.Paused, () => {
        console.log('Player está pausado!');
      });

      player.on(AudioPlayerStatus.AutoPaused, () => {
        console.log('Player foi pausado automaticamente!');
        if (player.state.status === AudioPlayerStatus.AutoPaused) {
          console.log('Tentando retomar a reprodução...');
          player.unpause();
        }
      });

      player.on('error', error => {
        console.error('Erro no player de áudio:', error.message);
        connection.destroy();
      });

      // Inicia a reprodução
      console.log('Iniciando reprodução...');
      player.play(resource);

      // Aguarda o player terminar de tocar
      await new Promise<void>((resolve) => {
        player.on(AudioPlayerStatus.Idle, () => {
          console.log('Reprodução concluída');
          resolve();
        });
      });

    } catch (error) {
      console.error('Erro no playAudio:', error);
      throw error;
    }
  }
} 