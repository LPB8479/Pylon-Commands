import { config } from '../config/config';
import { displayColor } from '../functions/displayColor';
import { convertIDtoUnix } from '../functions/convertIDtoUnix'
//Usage: info [user]
config.commands.on(
    {
        name: 'info',
        aliases: ['i'],
        description: 'Get information about a user'
    },
    (args) => ({
        member: args.guildMemberOptional()
    }),
    async (message, { member }) => {
        var member = (member == null) ? message.member : member
        await message.reply(
            new discord.Embed({
                color: await displayColor(member),
                footer: { text: `ID: ${member.user.id}` },
                author: {
                    name: member.user.getTag(),
                    iconUrl: member.user.getAvatarUrl()
                },
                description: `[Avatar](${member.user.getAvatarUrl()})`,
                fields: [
                    {
                        inline: true,
                        name: `Roles`,
                        value: `<@&${member.roles.toString().replace(/,/g, '> <@&')}>`
                    },
                    {
                        inline: true,
                        name: 'Created at',
                        value: `${new Date(convertIDtoUnix(member.user.id) * 1000).toUTCString().split(', ')[1]}\n<t:${convertIDtoUnix(member.user.id)}>`/*\n(${timeDelta(convertIDtoUnix(member.user.id))})*/
                    },
                    {
                        inline: true,
                        name: 'Joined at',
                        value: `${new Date(member.joinedAt).toUTCString().split(', ')[1]}\n<t:${Math.floor(Date.parse(member.joinedAt)/1000)}>`
                    }
                ]
            })
        );
    });