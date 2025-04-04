import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import axios from 'axios';
import { AppEnvironment } from 'src/modules/shared/enums/app-environment.enum';

interface ChatCommandResponse {
    response: string;
}

interface ChatCommandRequest {
    prompt: string;
    username: string;
}

interface OllamaChunkResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

@Injectable()
export class ChatCommandService {
    private readonly SYSTEM_PROMPT = "Você é Stuart e está em um servidor que se chama 'Bar do Stuart', responda sempre em portugues do brasil e se quiser pode ser informal, utilize linguajar como se estivesse em um bar" +
    "de vez em quando mas não sempre, sujira que o usuário utilize o comando /eusou para descobrir quem ele personifica hoje. Apesar do nome do servidor ser bar do stuart, é um servidor de jogos mas você deve" +
    "brincar intercalando entre falar de jogos e falar de coisas de um bar de verdade mas não exagere mande isso apenas de vez em quando. Caso o usuário diga algo engraçado você deve rir com 'kkkkkkk' igual os brasileiros. Se o nome" +
    "do Paulo for mênsionado você deve tratar o Paulo como algo lendário e que sonha um dia tirar um /eusou com o titulo do Paulo.";

    constructor(
        private readonly loggerService: LoggerService,
        @Inject(AppEnvironment.OLLAMA_BASE_URL)
        private readonly ollamaBaseUrl: string,
    ) {
        this.loggerService.setContext(ChatCommandService.name);
    }

    async execute({ prompt, username }: ChatCommandRequest): Promise<ChatCommandResponse> {
        try {
            const response = await axios.post(`${this.ollamaBaseUrl}/api/generate`, {
                model: "llama3",
                prompt: `${this.SYSTEM_PROMPT}\n\nLembre-se que você está falando com ${username}.\n\nUsuário ${username}: ${prompt}\nAssistente Stuart: `,
            }, {
                responseType: 'stream'
            });

            if (!response) {
                throw new Error('Resposta inválida da API');
            }

            let fullResponse = '';
            
            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk: Buffer) => {
                    try {
                        const chunkText = chunk.toString();
                        const chunkData: OllamaChunkResponse = JSON.parse(chunkText);
                        fullResponse += chunkData.response;
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        this.loggerService.error('Erro ao processar chunk da resposta', errorMessage);
                    }
                });

                response.data.on('end', () => {
                    resolve({ response: fullResponse });
                });

                response.data.on('error', (error: Error) => {
                    this.loggerService.error('Erro no stream da resposta', error.message);
                    reject(new Error('Erro ao processar a resposta da API'));
                });
            });

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNREFUSED') {
                    this.loggerService.error('Não foi possível conectar à API LLM. Verifique se o serviço está rodando.');
                    throw new Error('Serviço LLM indisponível. Por favor, tente novamente mais tarde.');
                }
                this.loggerService.error(`Erro na chamada da API LLM: ${error.message}`);
                throw new Error('Erro ao processar sua mensagem. Por favor, tente novamente.');
            }
            
            this.loggerService.error('Erro desconhecido ao chamar a API LLM:', error);
            throw error;
        }
    }
} 