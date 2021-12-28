import { config } from '../config/config';
import { convertIDtoUnix } from '../functions/convertIDtoUnix'

function timeDiff(timestamp: any) {
  var eventDate = new Date(timestamp);
  var nowDate = new Date(Date.now()); // get total seconds between the times
  var output = [];
  var delta = Math.abs(nowDate.getTime() - eventDate.getTime()) / 1000;

  // calculate (and subtract) whole years
  var years = Math.floor(delta / 31536000);
  delta -= years * 31536000;
  if (years != 0) {
    output.push(years == 1 ? `${years} year` : `${years} years`);
  }

  // calculate (and subtract) whole months
  var months = Math.floor(delta / 2629746);
  delta -= months * 2629746;
  if (months != 0) {
    output.push(months == 1 ? `${months} month` : `${months} months`);
  }

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;
  if (days != 0) {
    output.push(days == 1 ? `${days} day` : `${days} days`);
  }

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  if (hours != 0) {
    output.push(hours == 1 ? `${hours} hour` : `${hours} hours`);
  }

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  if (minutes != 0) {
    output.push(minutes == 1 ? `${minutes} minute` : `${minutes} minutes`);
  }

  // what's left is seconds
  var seconds = Math.round(delta % 60); // in theory the modulus is not required
  if (seconds != 0) {
    output.push(seconds == 1 ? `${seconds} second` : `${seconds} seconds`);
  }
  return `${output[0]}, ${output[1]}, and ${output[2]} ago`;
}

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
      value: `**Name:** ${message.author.getTag()} ${message.author.toMention()}\n**Joined:** ${timeDiff(
        message.member?.joinedAt
      )}\n**Sent from:** ${channel?.toMention()}`
    });
    for (var mentionCount = 0; mentionCount < mentions.length; mentionCount++) {
      var guild = await discord.getGuild();
      var mentionMember = await guild.getMember(mentions[mentionCount].id);
      embed.addField({
        inline: true,
        name: `Mentioned user #${mentionCount + 1}`,
        value: `**Name:** ${mentionMember?.user.getTag()} ${mentionMember?.user.toMention()}\n**Joined:** ${timeDiff(
          mentionMember?.joinedAt
        )}\n**ID:** ${mentionMember?.user.id}`
      });
    }
    embed.setFooter({
      text: `Author ID: ${message.author.id}`
    });
    embed.setTimestamp(new Date().toISOString());
    await destChannel?.sendMessage(embed);
  }
);
