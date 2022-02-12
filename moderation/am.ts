import { config } from '../config/config';
import { amConfig } from '../config/amconfig';

config.commands.raw(
    {
        name: 'am',
        description: 'Show current automod config',
        filters: discord.command.filters.canManageMessages()
    },
    async (message) => {
        var guild = await discord.getGuild()
        function getPunish(obj: { deleteMessage: any; warn?: boolean; tempmute?: (number | boolean)[]; mute?: boolean; kick?: boolean; tempban?: (number | boolean)[]; ban?: boolean; defer?: boolean; message?: (string | boolean)[]; }) {
            var punishmentArray: string[] = []
            if (obj.deleteMessage == true) { punishmentArray.push(`delete`) }
            if (obj.warn == true) { punishmentArray.push(`warn`) }
            if (obj.tempmute![0] == true) { punishmentArray.push(`tempmute (${obj.tempmute![1]} m)`) }
            if (obj.mute == true) { punishmentArray.push(`mute`) }
            if (obj.kick == true) { punishmentArray.push(`kick`) }
            if (obj.tempban![0] == true) { punishmentArray.push(`tempban (${obj.tempban![1]} m)`) }
            if (obj.ban == true) { punishmentArray.push(`ban`) }
            if (obj.defer == true) { punishmentArray.push(`defer`) }
            if (obj.message![0] == true) { punishmentArray.push(`message`) }
            var output = punishmentArray.toString().replace(/,/g, ', ')
            return (output == '') ? 'none' : output
        }
        async function channelMention(id: string) {
            var channel = await discord.getGuildTextChannel(id)
            var channelMentionOutput = channel?.toMention()
            return channelMentionOutput
        }
        async function roleArrayMention(arr: any[]) {
            var roleArray: string[] = [];
            for (var roleCount = 0; roleCount < arr.length; roleCount++) {
              var role = await guild.getRole(arr[roleCount]);
              roleArray.push(role!.toMention());
            }
            return roleArray.toString().replace(/,/g, ', ');
          }
        var deleteFilesCheck = (amConfig.scaryfiles.delete = true) ? '✅ On' : '❌ Off'
        var embed = new discord.Embed();
        embed.setTitle(`Automod config for ${guild.name}`)
        embed.setColor(0x56daac)
        embed.setFields([
            {
                name: 'Bad links',
                value: `**Permission level:** ${amConfig.badlinks.mode}\n**Punishment:** ${getPunish(amConfig.badlinks.punish)}`,
                inline: true
            },
            {
                name: 'Invites',
                value: `**Permission level:** ${amConfig.badinvites.mode}\n**Punishment:** ${getPunish(amConfig.badinvites.punish)}`,
                inline: true
            },
            {
                name: 'Bad words',
                value: `**Punishment:** ${getPunish(amConfig.badwords.punish)}`,
                inline: true
            },
            {
                name: 'Whitelisted roles',
                value: `${await roleArrayMention(amConfig.config.whitelistedroles)}`,
                inline: true
            },
            {
                name: 'Log channel',
                value: `${await channelMention(amConfig.config.modlogchannel)}`,
                inline: true
            },
            {
                name: 'Drama channel',
                value: `${await channelMention(amConfig.config.dramachannel)}`,
                inline: true
            },
            {
                name: 'Delete files',
                value: deleteFilesCheck,
                inline: true
            },
            {
                name: 'Caps lock',
                value: `**Threshold:** ${amConfig.capsspam.limit}%\n**Punishment:** ${getPunish(amConfig.capsspam.punish)}`,
                inline: true
            }
        ])
        await message.reply(embed)
    }
);