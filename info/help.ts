import { config } from '../config/config';

function commandSearch(string: String) {
    const str = string?.toLowerCase()
    let info
    switch (str) {
        case 'ban':
            info = ['moderation', '[p]ban <member> [reason]', '', 'Ban another member', '`BAN MEMBERS`', ''];
            break
        case 'kick':
            info = ['moderation', '[p]kick <member> [reason]', '', 'Kick another member', '`KICK MEMBERS`', ''];
            break
        case 'am':
            info = ['moderation', '[p]am', '', 'Show current automod config', '`MANAGE MESSAGES`', ''];
            break
        case 'mute':
            info = ['moderation', '[p]mute <member> [reason]', '', 'Indefinitly another member', '`MANAGE ROLES`', ''];
            break
        case 'tempmute':
            info = ['moderation', '[p]tempmute <member> <duration> [reason]', '', 'Temporarily another member', '`MANAGE ROLES`', ''];
            break
        case 'report':
            info = ['moderation', '[p]report <message>', '', 'Send a message to server staff', '', ''];
            break
        case 'rules':
        case 'rule':
            info = ['moderation', '[p]rule [keyword|rule number]', 'rules', 'Display server rules', '', ''];
            break
        case 'setnick':
            info = ['moderation', '[p]setnick <member> <new nick>', '', `Change a member's nickname`, '`MANAGE NICKNAMES`', ''];
            break
        case 'warn':
            info = ['moderation', '[p]warn <member> [reason]', '', 'Warn another member', '`MANAGE ROLES`', ''];
            break
        case 'addemoji':
            info = ['server management', '[p]addemoji <emoji name> <emoji url>', '', 'Add server emoji', '`MANAGE EMOJIS`', [['[p]addemoji color <emoji name> <color>', 'Create an emoji of a colored circle']]];
            break
        case 'addemoji color':
            info = ['server management', '[p]addemoji color <emoji name> <color>', '', 'Create an emoji of a colored circle', '`MANAGE EMOJIS`', ''];
            break
        case 'cembed':
            info = ['bot management', '[p]cembed <paste key>', '', 'Send an embed using a pastebin link (Only include the paste key)', '`MANAGE MESSAGES`', ''];
            break
        case 'clonechannel':
            info = ['bot management', '[p]clonechannel <base channel> <new channel name>', '', 'Create a channel with permissions copied from another channel', '`MANAGE CHANNELS`', ''];
            break
        case 'convert':
        case 'color':
        case 'clr':
        case 'colorconvert':
            info = ['utility', '[p]colorconvert [color format] [color value]', '`color`, `clr`, `convert`', 'Convert between different color formats. Not including any arguments will generate a random color', '', ''];
            break
        case 'convert avg':
        case 'color avg':
        case 'clr avg':
        case 'colorconvert avg':
        case 'convert av':
        case 'color av':
        case 'clr av':
        case 'colorconvert av':
        case 'convert average':
        case 'color average':
        case 'clr average':
        case 'colorconvert average':
            info = ['utility', `[p]colorconvert average [hex string]`, '`avg`, `av`', 'Get the average of two or more colors', '', ''];
            break
        case 'repeat':
        case 'echo':
            info = ['bot management', '[p]echo [channel] <message>', 'repeat', 'Get the bot to repeat whatever you say', '`MANAGE MESSAGES`', ''];
            break
        case 'embed':
            info = ['bot management', '[p]embed <channel> <color> <title|description>', '', 'Send a simple embed', '`MANAGE MESSAGES`', ''];
            break
        case 'embedsource':
            info = ['utility', '[p]embedsource <message id> [channel]', '', 'Get the raw json from any embed', '', ''];
            break
        case 'getid':
            info = ['utility', '[p]getid <input string>', '', 'Get the id of a user, role, channel, or emoji', '', ''];
            break
        case 'ping':
            info = ['bot management', '[p]ping', '', 'Pong!', '', ''];
            break
        case 'react':
            info = ['bot management', '[p]react <channel> <message id> <emoji>', '', 'Add a reaction to a message. Useful for setting up reaction roles', '`MANAGE MESSAGES`', ''];
            break
        case 'role':
            info = ['server management', '[p]role <member> <role id>', '', "Manage a member's roles", '`MANAGE ROLES`', [['[p]role add <member> <role id>', 'Create a new role with default permissions'], ['[p]role remove <member> <role id>', 'Remove a role from a member'], ['[p]role create <name> <color>', 'Create a new role with default permissions'], ['[p]role color <role id> <new color>', 'Change the color of a role']]];
            break
        case 'role create':
            info = ['server management', '[p]role create <name> <color>', '', 'Create a new role with default permissions', '`MANAGE ROLES`', ''];
            break
        case 'role add':
            info = ['server management', '[p]role add <member> <role id>', '', 'Add a role to a member', '`MANAGE ROLES`', ''];
            break
        case 'role remove':
            info = ['server management', '[p]role remove <member> <role id>', '', 'Remove a role from a member', '`MANAGE ROLES`', ''];
            break
        case 'role color':
            info = ['server management', '[p]role color <role id> <new color>', '', 'Change the color of a role', '`MANAGE ROLES`', ''];
            break
        case 'info':
        case 'i':
            info = ['information', '[p]info [member]', 'i', 'Get information about a member', '', ''];
            break
        case 'how':
            info = ['information', '[p]how [keyword]', '', 'Get information about how to use Discord, the server, and server bots', '', ''];
            break
        case 'serverinfo':
            info = ['information', '[p]serverinfo', '', 'Get information about the server', '', ''];
            break
        case 'avatar':
        case 'av':
            info = ['information', '[p]avatar [member]', 'av', `Get a member's avatar in various formats`, '', ''];
            break
        default:
            info = ['null', '', '', '', '', ''];
            break
    }
    return info;
}

function makeEmbed(data: string[]): string {
    const embed = new discord.Embed();
    embed.setColor(0x758ad7)
    let desc = data[3]
    if (data[0]! == null) {
        embed.setTitle('Pylon Custom Bot');
        embed.setDescription(`A discord bot made by LPB#0001 and hosted and run by Pylon.\nMade with TypeScript\n[Pylon](https://pylon.bot/)\n[Source Repo](https://github.com/LPB8479/Pylon-Commands)\n[Suggestions and Bug Reports](https://github.com/LPB8479/Pylon-Commands/issues/new)`);
    } else {
        embed.setTitle(data[1]);
        if (data[2]! != null && data[2]! != undefined && data[2]! != "") { desc! += `\n**Aliases:** ${data[2]}` }
        if (data[4]! != null && data[4]! != undefined && data[4]! != "") { desc! += `\n**Required Permissions:** ${data[4]}` }
        if (data[5]! != null && data[5]! != undefined && data[5]! != "") {
            desc! += `\n ​`/*Whitespace character to add empty line*/
            Array.from(data[5]).forEach((sub) => {
                embed.addField({
                    inline: false,
                    name: sub[0],
                    value: sub[1]
                })
            })
        }
        embed.setDescription(desc)
    }
    return embed;
}

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
        const search = (input == null) ? [null] : commandSearch(input);
        const embed = makeEmbed(search)
        await message.reply(embed)
    }
);

config.slashCommands.register(
    {
        name: 'help',
        description: 'Get help about commands',
        options: (opt) => ({
            input: opt.string('Search')
        })
    },
    async (interaction, { input }) => {
        const search = commandSearch(input);
        const embed = makeEmbed(search)
        await interaction.respond({
            embeds: [embed],
          });
    }

);