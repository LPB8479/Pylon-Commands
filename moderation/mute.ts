import { config } from '../config/config';
import { timeStringToMS } from '../functions/timestringToMs';
import { modlogCount } from '../functions/modlogCount'

config.commands.on(
  {
    name: 'mute',
    description: 'Indefinitly another user',
    filters: discord.command.filters.canManageRoles()
    //  filters: discord.command.filters.hasRole(config.role.modRole)
  },

  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    await message.reply(
      '**' +
      message.author.getTag() +
      '** muted **' +
      member.user.getTag() +
      '** indefinitely.'
    );
    await member.addRole(config.role.muteRole);
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle('Mute | Case ' + uses);
    embed.setColor(0xf48942);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
  }
);

config.commands.on(
  {
    name: 'tempmute',
    description: 'Temporarily another user',
    filters: discord.command.filters.isAdministrator()
    //  filters: discord.command.filters.hasRole(config.role.modRole)
  },

  (args) => ({
    member: args.guildMember(),
    duration: args.string(),
    reason: args.textOptional()
  }),
  async (message, { member, duration, reason }) => {
    var durIn = duration.replace(/[^0-9](?=[0-9])/g, '$& ').toLowerCase().split(' ');
    var durFull = '';
    for (var timepiece /*I have nothing better to name this variable*/ = 0; timepiece < durIn.length; timepiece++) {
      var durReplace = durIn[timepiece]
        .replace('m', ' minute')
        .replace('h', ' hour')
        .replace('y', ' year')
        .replace('d', ' day');
      var durMult = parseInt((durIn[timepiece].split(' '))[0]) != 1 ? `${durReplace}s` : durReplace;
      (timepiece == 0) ? durFull += `${durMult}` : ((timepiece + 1) != durIn.length) ? durFull += ` ${durMult}` : durFull += ` and ${durMult} `;
    }
    var muteDuration = timeStringToMS(duration)
    await config.kv.tempmute.put(
      member.user.id,
      `${Date.now() + muteDuration},${durFull}`,
      { ifNotExists: true }
    );
    await member.addRole(config.role.muteRole);
    await message.reply('**' + message.author.getTag() + '** muted **' + member.user.getTag() + '** for ' + durFull + '.');
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle('Mute | Case ' + uses);
    embed.setColor(0xf48942);
    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Duration:** ${durFull}\n**Reason:** ${reason}\n**Responsible moderator:** ${message.author.getTag()}`);
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
  }
);

//Automatically check for unmutes every 5 mins
pylon.tasks.cron('Every_5_Min', '0 0/5 * * * * *', async () => {
  const now = Date.now();
  // get all our items of potentially muted users
  const items = await config.kv.tempmute.items();
  // get our guild object
  const guild = await discord.getGuild();
  let toRemove: string[] = [];
  // loop thru every item to see if it expired
  await Promise.all(
    items.map(async (val) => {
      const member = await guild.getMember(val.key);
      // if the member is no longer on your server, or no longer has the mute role, let's remove it
      if (member === null || !member.roles.includes(config.role.muteRole)) {
        toRemove.push(val.key);
        return;
      }
      const valArray = val.value?.toString().split(',');
      if (typeof valArray[0] !== 'number') return; // type safety check
      const diff = now - valArray[0];
      if (diff > 0) {
        // The mute has expired!
        await member.removeRole(config.role.muteRole);
        toRemove.push(val.key);
        const channel = await discord.getGuildTextChannel(
          config.channel.modlog
        );
        let uses = await modlogCount('count');
        // Assemble embed
        var embed = new discord.Embed();
        embed.setTitle('Unmute | Case ' + uses);
        embed.setColor(0x47f0a6);
        embed.setDescription(
          `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** Automatic unmute from mute made ${valArray[1]
          } ago\n**Responsible moderator:**${await discord.getBotUser()}`
        );
        embed.setFooter({ text: `ID: ${member.user.id}` });
        embed.setTimestamp(new Date().toISOString());
        await channel?.sendMessage(embed);
      }
    })
  );
  // clean our KVs for expired mutes
  if (toRemove.length > 0) {
    // @ts-ignore
    for (var removeCount = 0; removeCount < toRemove.length; removeCount++) {
      await config.kv.tempmute.delete(toRemove[removeCount])
    }
  }
});

config.commands.on(
  {
    name: 'unmute',
    description: 'Unmute another user',
    filters: discord.command.filters.isAdministrator()
    //  filters: discord.command.filters.hasRole(config.role.modRole)
  },
  (args) => ({
    member: args.guildMember(),
    reason: args.textOptional()
  }),
  async (message, { member, reason }) => {
    await message.reply(`Successfully unmuted **${member.user.getTag()}**`);

    try {
      await config.kv.tempmute.delete(member.user.id);
    } catch {
      console.log('Previous mute was permanent (ignore this error)');
    }

    await member.removeRole(config.role.muteRole);

    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle('Unmute | Case ' + uses);
    embed.setColor(0x47f0a6);
    embed.setDescription(
      `**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${message.author.getTag()}`
    );
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
  }
);
