import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const AUDIO_PATH = path.join(process.cwd(), 'audios');
const SUPPORTED_FORMATS = ['.mp3', '.m4a', '.aac', '.opus'];
const TARGET_FORMAT = '.ogg';

async function convertAudio(inputPath: string, outputPath: string): Promise<void> {
    try {
        console.log(`Convertendo ${inputPath} para ${outputPath}...`);
        const command = `ffmpeg -i "${inputPath}" -c:a libopus -b:a 128k -vbr on -compression_level 10 "${outputPath}"`;
        const { stderr } = await execAsync(command);
        if (stderr) {
            console.log(`Log do FFmpeg para ${inputPath}:`, stderr);
        }
        console.log(`Conversão concluída: ${outputPath}`);
    } catch (error) {
        console.error(`Erro ao converter ${inputPath}:`, error);
    }
}

async function main() {
    try {
        console.log('Iniciando conversão de áudios...');
        const files = fs.readdirSync(AUDIO_PATH);
        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
        console.log(`Encontrados ${audioFiles.length} arquivos para converter.`);
        for (const file of audioFiles) {
            const inputPath = path.join(AUDIO_PATH, file);
            const outputPath = path.join(
                AUDIO_PATH,
                `${path.basename(file, path.extname(file))}${TARGET_FORMAT}`
            );
            
            await convertAudio(inputPath, outputPath);
        }
        console.log('Conversão de todos os áudios concluída!');
    } catch (error) {
        console.error('Erro durante o processo de conversão:', error);
    }
}

main(); 