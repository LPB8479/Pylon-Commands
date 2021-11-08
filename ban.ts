import { config } from '../config/config';

config.commands.on(
  {
    name: 'ban',
    description: 'Ban another user',
    filters: discord.command.filters.canBanMembers()
  },

  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    async function UsesCounter(key: any, by: number = 1): Promise<number> {
      const nextValue = await config.kv.modlog.transact<number>(
        key,
        (prevValue = 0) => {
          return prevValue + by;
        }
      );
      return nextValue!;
    }
    await message.reply(`Banned **${member.user.getTag()}**.`);
    await member.ban();
    const channel = await discord.getGuildTextChannel('875212427132805180');
    let uses = await UsesCounter('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`ban | Case ${uses}`);
    embed.setColor(0xdd5e53);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:**' ${reason}'\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel.sendMessage(embed);
  }
);
