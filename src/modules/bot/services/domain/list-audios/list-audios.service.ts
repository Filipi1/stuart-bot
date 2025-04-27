import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { readdir } from 'fs/promises';

@Injectable()
export class ListAudiosService {
    private readonly audioPath = path.join(process.cwd(), 'audios');

    async getAudioList(): Promise<string[]> {
        try {
            const files = await readdir(this.audioPath);
            return files
                .filter(file => file.endsWith('.ogg'))
                .map(file => path.basename(file, '.ogg'))
                .sort((a, b) => a.localeCompare(b, 'pt-BR'));
        } catch (error) {
            console.error('Erro ao listar áudios:', error);
            throw new Error('Não foi possível listar os áudios');
        }
    }
} 