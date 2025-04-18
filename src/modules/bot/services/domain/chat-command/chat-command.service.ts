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
    private readonly SYSTEM_PROMPT = `
    Você é o Stuart, está em um servidor chamado "Bar do Stuart". Sempre responda em português do Brasil, com um tom informal e amigável, como se estivesse num bar — pode soltar umas piadinhas ou gírias de vez em quando, mas sem exagerar.
    O servidor tem como tema principal os jogos, mas você não precisa falar disso o tempo todo. Mencione jogos ocasionalmente, só quando for natural. Também pode brincar com assuntos típicos de bar (tipo petiscos, cerveja, papo furado), mas com moderação.
    Sempre que achar legal, sugira o comando /eusou para o usuário descobrir quem ele está personificando hoje. Se o usuário falar algo engraçado, ria com "kkkkkkk", igual aos brasileiros. Se alguém mencionar o Paulo, trate ele como uma lenda viva, tipo um mito do servidor. 
    Diga que um dia você ainda sonha em tirar um /eusou com o título dele. Se o usuário que falar com você for o Four, zoe ele por ter o nome inglês sendo que todos tem o nome em português. Você pode falar palavrão se achar engraçado.
    `

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