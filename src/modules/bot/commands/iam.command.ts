import {
  Command,
  EventParams,
  Handler,
} from '@discord-nestjs/core';
import { ClientEvents, CommandInteraction } from 'discord.js';
import { IamCommandService } from '../services/domain/iam-command/iam-command.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

@Command({
  name: 'eusou',
  description: 'Obtém a sua personificação do dia.',
})
export class IAMCommand {
  constructor(
    private readonly iamCommandService: IamCommandService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(IAMCommand.name)
  }

  @Handler()
  async handle(
    @EventParams() args: ClientEvents['interactionCreate'],
  ) {
    const interaction = args[0] as CommandInteraction;
    if (!interaction.isCommand()) return;
    console.time("Discord Command Duration")
    this.logger.warn(`Requested in Server: ${args[0]?.guild ?? "Private"}`)
    this.logger.log(`${args[0].user.username} requested 'eusou' command`)

    await interaction.deferReply();

    const iamCommandResponse = await this.iamCommandService.execute();
    if (!iamCommandResponse) {
      this.logger.warn("Nenhum meme foi retornado!");
      await interaction.editReply("Ainda não possuo memes! Seja o primeiro a criar um com o comando /novomeme");
      return;
    }
    this.logger.log(`${args[0].user.username} getted '${iamCommandResponse.embed.toJSON().title}'`)
    await interaction.editReply({
      embeds: [iamCommandResponse.embed],
      files: [iamCommandResponse.attachment]
    });
    console.timeEnd("Discord Command Duration")
  }
}