import { config } from '../config/config';
import { modlogCount } from '../functions/modlogCount'

//Usage: [p]warn <member> [reason]
config.commands.on(
  {
    name: 'warn',
    description: 'Warn another user',
    filters: discord.command.filters.canManageRoles()
    //  filters: discord.command.filters.hasRole(config.role.modRole)
  },

  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    await message.reply(`**${member.user.getTag()}** has been warned.\n**Reason:** ${reason}`);
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`Warn | Case ${uses}`);
    embed.setColor(0xfcf77a);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel.sendMessage(embed);
  }
);
