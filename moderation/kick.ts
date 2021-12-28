import { config } from '../config/config';
import { modlogCount } from '../functions/modlogCount'
//Usage: [p]kick <member> [reason]
config.commands.on(
  {
    name: 'kick',
    description: 'Kick another user',
    filters: discord.command.filters.canKickMembers()
    //  filters: discord.command.filters.hasRole(config.role.modrole)
  },

  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    await message.reply(`Kicked **${member.user.getTag()}**.`);
    await member.kick();
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`Kick | Case ${uses}`);
    embed.setColor(0x4c88ff);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel.sendMessage(embed);
  }
);
