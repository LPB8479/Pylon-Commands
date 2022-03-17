import { config } from '../config/config';
import { convertIDtoUnix } from '../functions/convertIDtoUnix'
//Usage: info [user]
config.commands.raw(
    {
        name: 'serverinfo',
        description: 'Get information about the server'
    },
    async (message) => {
        var guild = await discord.getGuild()
        var date = new Date(convertIDtoUnix(guild.id) * 1000)
        var iconLink = guild.getIconUrl(discord.ImageType.PNG)
        var owner = await guild.getMember(guild.ownerId)
        var channels = await guild.getChannels()
        var channelCount = [0, 0, 0, 0] //[total text channel, locked text channel, total voice channel, locked voice channel]
        channels.forEach((channel) => {
            if (channel.type == 0) {
                channel.permissionOverwrites.forEach((perms) => {
                    if (perms.id == guild.id) {
                        channelCount[0]++
                        if (perms.allow == 0) { channelCount[1]++ }
                    }
                })
            } else if (channel.type == 2) {
                channel.permissionOverwrites.forEach((perms) => {
                    if (perms.id == guild.id) {
                        channelCount[2]++
                        if (perms.allow == 0) { channelCount[3]++ }
                    }
                })
            }
        })
        var verifLevel = ['none', 'low', 'medium', 'high', 'very high']
        var prefixes = (config.commands.options.mentionPrefix == true) ? `<@!270148059269300224> \n${config.commands.options.defaultPrefix}` : config.commands.options.defaultPrefix
        try {
            config.commands.options.additionalPrefixes.forEach((prefix) => {
                prefixes += `\n${prefix}`
            })
        } catch (err) {
            var thisVariableDoes = 'notMatterAtAll'
        }
        var memberCount = [0, 0] //[# of humans, # of bots]
        for await (const user of (await discord.getGuild()).iterMembers()) {
            if (user.user.bot == true) { memberCount[1]++ }
            else { memberCount[0]++ }
        }
        var roles = await guild.getRoles()
        await message.reply(
            new discord.Embed({
                color: 0x758ad7,
                footer: { text: `ID: ${guild.id}, Created` },
                timestamp: date.toISOString(),
                thumbnail: { url: iconLink },
                title: `Info for ${guild.name}`,
                fields: [
                    {
                        inline: true,
                        name: `Owner`,
                        value: owner?.user.getTag()
                    },
                    {
                        inline: true,
                        name: 'Channels',
                        value: `<:text_channel:953882716955361370> ${channelCount[0]} (${channelCount[1]} locked)\n<:voice_channel:953882820735016961> ${channelCount[2]} (${channelCount[3]} locked)`
                    },
                    {
                        inline: true,
                        name: 'Info',
                        value: `${guild.explicitContentFilter == 0 ? `<:redtick:953884196743565322>` : `<:greentick:953884218390347817>`} Scanning Images\nVerification level: ${verifLevel[guild.verificationLevel]}\n[Icon link](${iconLink})`
                    },
                    {
                        inline: true,
                        name: `Prefixes`,
                        value: `${prefixes}`
                    },
                    {
                        inline: true,
                        name: `Members`,
                        value: `Total: ${memberCount[0] + memberCount[1]}\nHumans: ${memberCount[0]}\nBots: ${memberCount[1]}`
                    },
                    {
                        inline: true,
                        name: `Roles`,
                        value: `${roles.length} roles`
                    }
                ]
            })
        );
    });