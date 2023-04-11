import { config } from '../config/config';
import { timeStringToMS } from '../functions/timestringToMs';
import { bitfieldToArray } from '../functions/bitfieldToArray';


config.commands.on(
    {
        name: 'lock',
        description: 'Lock a channel or the whole server'
    },
    (args) => ({
        input: args.textOptional()
    }),
    async (message: discord.Message, { input }) => {
        var guild = await discord.getGuild()
        var args = input.toLowerCase().split(' ')
        var duration = (args.length == 2) ? timeStringToMS(args[1]) : null
        if (args.includes('guild') || args.includes('server')) {
            var everyone = await guild.getRole(guild.id)
            var existingPerms = everyone?.permissions
            var existingPermsArray = bitfieldToArray(existingPerms)
            if (existingPermsArray.includes('SEND_MESSAGES') == false) {
                message.reply(`Make sure the \`Send Messages\` permission for the \`@everyone\` role is turned on in your server's global settings.`)
            } else {
                var newPerms = existingPerms + discord.Permissions.SEND_MESSAGES
                await everyone?.edit({ permissions: newPerms })
                if (duration != null) {
                    await config.kv.lock.put('guild', Date.now() + duration);
                    var durationString = `in <t:${Math.floor((Date.now() + duration) / 1000)}:R> at <t:${Math.floor((Date.now() + duration) / 1000)}>`
                } else {
                    var durationString = 'undefined'
                }
                //make and send embed
                var embed = new discord.Embed();
                embed.setColor(11010048)
                embed.setAuthor({ name: guild.name })
                embed.setTitle('🔒 Server Locked')
                embed.setDescription(`**You are not muted, nobody can talk!**\n\nThe server will be unlocked ${durationString}.`)
                embed.setFooter({
                    text: `Locked by ${message.author.getTag()}`,
                    iconUrl: message.author.getAvatarUrl(discord.ImageType.PNG)
                })
                message.reply(embed)
            }
        } else {
            var channelCheck = await discord.getGuildTextChannel(args[0].replace('<#', '').replace('>', ''))
            if (channelCheck == null && (args.length == 2 || args.length == 0)) {
                message.reply('Invalid channel mention')
            } else {
                var channel = (channelCheck == null) ? await discord.getGuildTextChannel(message.channelId) : channelCheck
                var overwrites = channel.permissionOverwrites
                var roleCount = 0
                overwrites.forEach((roleInfo, count) => {
                    if (roleInfo.id == guild.id) {
                        roleCount += count
                    }
                })
                var newPerms = deny + discord.Permissions.SEND_MESSAGES
                await channel.edit({
                    //removes all overwrites for everyone for some reason
                    permissionOverwrites: 
                });
                if (duration != null) {
                    await config.kv.lock.put(channel.id.toString(), Date.now() + duration);
                    var durationString = `in <t:${Math.floor((Date.now() + duration) / 1000)}:R> at <t:${Math.floor((Date.now() + duration) / 1000)}>`
                } else {
                    var durationString = 'undefined'
                }
                //make and send embed
                var embed = new discord.Embed();
                embed.setColor(11010048)
                embed.setAuthor({ name: channel.name })
                embed.setTitle('🔒 Channel Locked')
                embed.setDescription(`**You are not muted, nobody can talk!**\n\n${channel.toMention()} will be unlocked ${durationString}.`)
                embed.setFooter({
                    text: `Locked by ${message.author.getTag()}`,
                    iconUrl: message.author.getAvatarUrl(discord.ImageType.PNG)
                })
                message.reply(embed)
            }
        }
    });