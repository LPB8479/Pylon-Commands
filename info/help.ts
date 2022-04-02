import { config } from '../config/config';
//Usage: help [command]
config.commands.on(
    {
        name: 'help',
        description: 'Get help about commands'
    },
    (args) => ({
        input: args.textOptional()
    }),
    async (message, { input }) => {
        var str = input?.toLowerCase()
        switch (str) {
            case 'ban':
                var category = 'moderation'
                var syntax = '[p]ban <member> [reason]'
                var desc = 'Ban another member'
                var perms = '`BAN MEMBERS`'
                break
            case 'kick':
                var category = 'moderation'
                var syntax = '[p]kick <member> [reason]'
                var desc = 'Kick another member'
                var perms = '`KICK MEMBERS`'
                break
            case 'am':
                var category = 'moderation'
                var syntax = '[p]am'
                var desc = 'Show current automod config'
                var perms = '`MANAGE MESSAGES`'
            case 'mute':
                var category = 'moderation'
                var syntax = '[p]mute <member> [reason]'
                var desc = 'Indefinitly another member'
                var perms = '`MANAGE ROLES`'
                break
            case 'tempmute':
                var category = 'moderation'
                var syntax = '[p]tempmute <member> <duration> [reason]'
                var desc = 'Temporarily another member'
                var perms = '`MANAGE ROLES`'
                break
            case 'report':
                var category = 'moderation'
                var syntax = '[p]report <message>'
                var desc = 'Send a message to server staff'
                break
            case 'rules':
            case 'rule':
                var category = 'moderation'
                var syntax = '[p]rule [keyword|rule number]'
                var aliases = 'rules'
                var desc = 'Display server rules'
                break
            case 'setnick':
                var category = 'moderation'
                var syntax = '[p]setnick <member> <new nick>'
                var desc = `Change a member's nickname`
                var perms = '`MANAGE NICKNAMES`'
                break
            case 'warn':
                var category = 'moderation'
                var syntax = '[p]warn <member> [reason]'
                var desc = 'Warn another member'
                var perms = '`MANAGE ROLES`'
                break
            case 'addemoji':
                var category = 'server management'
                var syntax = '[p]addemoji <emoji name> <emoji url>'
                var desc = 'Add server emoji'
                var perms = '`MANAGE EMOJIS`'
                var subcommands = [['[p]addemoji color <emoji name> <color>', 'Create an emoji of a colored circle']]
                break
            case 'addemoji color':
                var category = 'server management'
                var syntax = '[p]addemoji color <emoji name> <color>'
                var desc = 'Create an emoji of a colored circle'
                var perms = '`MANAGE EMOJIS`'
                break
            case 'cembed':
                var category = 'bot management'
                var syntax = '[p]cembed <paste key>'
                var desc = 'Send an embed using a pastebin link (Only include the paste key)'
                var perms = '`MANAGE MESSAGES`'
                break
            case 'clonechannel':
                var category = 'server management'
                var syntax = '[p]clonechannel <base channel> <new channel name>'
                var desc = 'Create a channel with permissions copied from another channel'
                var perms = '`MANAGE CHANNELS`'
                break
            case 'convert':
            case 'color':
            case 'clr':
            case 'colorconvert':
                var category = 'utility'
                var syntax = '[p]convert [color format] [color value]'
                var aliases = '`color`, `clr`, `colorconvert`'
                var desc = 'Convert between different color formats. Not including any arguments will generate a random color'
                break
            case 'repeat':
            case 'echo':
                var category = 'bot management'
                var syntax = '[p]echo [channel] <message>'
                var aliases = 'repeat'
                var desc = 'Get the bot to repeat whatever you say'
                var perms = '`MANAGE MESSAGES`'
                break
            case 'embed':
                var category = 'bot management'
                var syntax = '[p]embed <channel> <color> <title|description>'
                var desc = 'Send a simple embed'
                var perms = '`MANAGE MESSAGES`'
                break
            case 'embedsource':
                var category = 'utility'
                var syntax = '[p]embedsource <message id> [channel]'
                var desc = 'Get the raw json from any embed'
                break
            case 'getid':
                var category = 'utility'
                var syntax = '[p]getid <input string>'
                var desc = 'Get the id of a user, role, channel, or emoji'
                break
            case 'ping':
                var category = 'bot management'
                var syntax = '[p]ping'
                var desc = 'Pong!'
                break
            case 'react':
                var category = 'bot management'
                var syntax = '[p]react <channel> <message id> <emoji>'
                var desc = 'Add a reaction to a message. Useful for setting up reaction roles'
                var perms = '`MANAGE MESSAGES`'
                break
            case 'role':
                var category = 'server management'
                var syntax = '[p]role <member> <role id>'
                var desc = 'Add or remove a role from a member'
                var perms = '`MANAGE ROLES`'
                var subcommands = [['[p]role add <member> <role id>', 'Create a new role with default permissions'], ['[p]role remove <member> <role id>', 'Remove a role from a member'], ['[p]role create <name> <color>', 'Create a new role with default permissions'], ['[p]role color <role id> <new color>', 'Change the color of a role']]
                break
            case 'role create':
                var category = 'server management'
                var syntax = '[p]role create <name> <color>'
                var desc = 'Create a new role with default permissions'
                var perms = '`MANAGE ROLES`'
                break
            case 'role add':
                var category = 'server management'
                var syntax = '[p]role add <member> <role id>'
                var desc = 'Add a role to a member'
                var perms = '`MANAGE ROLES`'
                break
            case 'role remove':
                var category = 'server management'
                var syntax = '[p]role remove <member> <role id>'
                var desc = 'Remove a role from a member'
                var perms = '`MANAGE ROLES`'
                break
            case 'role color':
                var category = 'server management'
                var syntax = '[p]role color <role id> <new color>'
                var desc = 'Change the color of a role'
                var perms = '`MANAGE ROLES`'
                break
            case 'info':
            case 'i':
                var category = 'information'
                var syntax = '[p]info [member]'
                var aliases = 'i'
                var desc = 'Get information about a member'
                break
            case 'how':
                var category = 'information'
                var syntax = '[p]how [keyword]'
                var desc = 'Get information about how to use Discord, the server, and server bots'
                break
            case 'serverinfo':
                var category = 'information'
                var syntax = '[p]serverinfo'
                var desc = 'Get information about the server'
                break
            case 'avatar':
            case 'av':
                var category = 'information'
                var syntax = '[p]avatar [member]'
                var desc = `Get a member's avatar in various formats`
            default:
                var category = 'n/a'
        }
        var embed = new discord.Embed();
        embed.setColor(0x758ad7)
        embed.setTitle((category == 'n/a') ? 'Pylon Custom Bot' : syntax!)
        if (category == 'n/a') {
            embed.setDescription('A discord bot made by LPB#0001 and hosted and run by Pylon.\nMade with TypeScript\n[Pylon](https://pylon.bot/)\n[Source Repo](https://github.com/LPB8479/Pylon-Commands)\n[Suggestions and Bug Reports](https://github.com/LPB8479/Pylon-Commands/issues/new)')
        } else {
            if (aliases! != null && aliases != undefined) {desc! += `\n**Aliases:** ${aliases}`}
            if (perms! != null && perms != undefined) {desc! += `\n**Required Permissions:** ${perms}`}
            desc! += `\n ​`/*Whitespace character to add empty line*/
            embed.setDescription(desc!)
        }
        if (subcommands! != null && subcommands != undefined) {
            subcommands.forEach((sub) => {
                embed.addField({
                    inline: false,
                    name: sub[0],
                    value: sub[1]
                })
            })
        }
        await message.reply(embed)
    }

);
