import { config } from '../config/config';
import { modlogCount } from '../functions/modlogCount'
//Usage: [p]ban <member> [reason]
config.commands.on(
  {
    name: 'ban',
    description: 'Ban another user',
    filters: discord.command.filters.canBanMembers()
    //  filters: discord.command.filters.hasRole(config.role.modrole)
  },

  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    await message.reply(`Banned **${member.user.getTag()}**.`);
    await member.ban({ reason: `${reason}.` });
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`ban | Case ${uses}`);
    embed.setColor(0xdd5e53);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel.sendMessage(embed);
  }
);
