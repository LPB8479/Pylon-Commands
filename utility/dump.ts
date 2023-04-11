import { config } from '../config/config';
//Usage: [p]dump <input string>
config.commands.on(
    {
        name: 'dump',
        description: 'Get a list of members'
    },
    (args) => ({
        input: args.textOptional()
    }),
    async (message, { input }) => {
        async function roleCheck(role: string) {
            try {
                var test = await guild.getRole(role)
                return test
            } catch { return null }
        }
        var guild = await discord.getGuild()
        if (input) {
            var lower = input.toLowerCase()
            var args = lower.split(' ')
            console.log(args)
            if (await roleCheck(args[0]) != null) {
                var role = (await roleCheck(args[0])).id
            } else if (args[0].includes('@&')) {
                var role = args[0].replace('<@&', '').replace('>', '')
            } else { var role = '' }
        }
        var members = []
        if (lower.includes('-l')) {
            var index = lower.indexOf('-l')
            var limit = index + 1
            for await (const member of guild.iterMembers({ limit: limit })) {
                members.push(member);
            }
        } else {
            for await (const member of guild.iterMembers()) {
                members.push(member);
            }
        }
        /*
        -l #: limit to # members
        -e: enumerate
        -f: format
            %u: username#discrim
            %n: nickname if exists else username
            %i: id
                %c: creation date
            %j: joined date
        */
        var flags = (role != '') ? lower : lower.slice(1)
        var format = flags.replace('-f ', '').replace('-e ', '').replace(/-l \d+ /gm, '')
        var outputArray = []
        members.forEach((member: discord.GuildMember, count) => {
            var tag = `${member.user.username}#${member.user.discriminator}`
            var nick = (member.nick != null) ? member.nick : member.user.username
            var id = member.user.id
            var joined = member.joinedAt
            var outputString = ''
            if (lower.includes('-e')) { outputString += `${count + 1}. ` }
            outputString += format.replace('%u', tag).replace('%n', nick).replace('%i', id).replace('%j', joined)
            outputArray.push(outputString)
        })
        var outputFinal = outputArray.toString().replace(/,/gm, '\n')

        //send data as attachment if content exceeds one message
        if (outputFinal.length >= 2000) {
            var contentEncoded = new TextEncoder().encode(outputFinal).buffer
            if (
                (await message.getChannel()).canMember(
                    await guild.getMember(discord.getBotId()),
                    discord.Permissions.ATTACH_FILES
                ) == false
            ) {
                message.reply('⚠️ Missing permission: Attach Files');
            } else {
                await message.reply({
                    attachments: [
                        {
                            name: 'dump',
                            data: contentEncoded,
                        },
                    ],
                });
            }
        } else {
            message.reply(outputFinal)
        }
    }
);
