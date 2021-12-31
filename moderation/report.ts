import { config } from '../config/config';
import { convertIDtoUnix } from '../functions/convertIDtoUnix'
import { timeDelta } from '../functions/timeDelta'

//Usage: [p]report <message>
config.commands.on(
  {
    name: 'report',
    description: 'Send a message to server moderators'
  },
  (args) => ({
    input: args.text()
  }),
  async (message: discord.Message, { input }) => {
    var channel = await discord.getGuildTextChannel(message.channelId);
    var destChannel = await discord.getGuildTextChannel(config.channel.report);
    var mentions = message.mentions;
    var embed = new discord.Embed();
    var authorJoinedUnix = Date.parse(message.member.joinedAt)
    embed.setColor(0xd0021b);
    embed.setAuthor({
      name: message.author.getTag(),
      iconUrl: message.author.getAvatarUrl()
    });
    embed.setTitle('New report');
    embed.setDescription(input);
    embed.addField({
      inline: true,
      name: `User info`,
      value: `**Name:** ${message.author.getTag()} ${message.author.toMention()}\n**Joined:** ${timeDelta(authorJoinedUnix)}\n**Sent from:** ${channel?.toMention()}`
    });
    for (var mentionCount = 0; mentionCount < mentions.length; mentionCount++) {
      var guild = await discord.getGuild();
      var mentionMember = await guild.getMember(mentions[mentionCount].id);
      var mentionJoinedUnix = Date.parse(mentionMember?.joinedAt)
      embed.addField({
        inline: true,
        name: `Mentioned user #${mentionCount + 1}`,
        value: `**Name:** ${mentionMember?.user.getTag()} ${mentionMember?.user.toMention()}\n**Joined:** ${timeDelta(mentionJoinedUnix)}\n**ID:** ${mentionMember?.user.id}`
      });
    }
    embed.setFooter({
      text: `Author ID: ${message.author.id}`
    });
    embed.setTimestamp(new Date().toISOString());
    await destChannel?.sendMessage(embed);
  }
);
