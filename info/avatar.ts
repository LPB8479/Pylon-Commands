import { config } from '../config/config';

config.commands.on(
    {
        name: 'avatar',
        aliases: ['av'],
        description: "Get a member's avatar in various formats"
    },
    (args) => ({
        member: args.stringOptional()
    }),
    async (message, { member }) => {
        var user = (member == null) ? message.member.user : await discord.getUser(member.replace('<@','').replace('!','').replace('>',''))
        var largeImage = `${user?.getAvatarUrl(discord.ImageType.PNG)}?size=1024`
        await message.reply(
            new discord.Embed({
                color: 0x758ad7,
                title: `Avatar for ${user?.getTag()}`,
                image: { url: largeImage },
                fields: [
                    {
                        inline: true,
                        name: `Link as`,
                        value: `[png](${user?.getAvatarUrl(discord.ImageType.PNG)}) | [jpg](${user?.getAvatarUrl(discord.ImageType.JPEG)}) | [webp](${user?.getAvatarUrl(discord.ImageType.WEBP)})`
                    }
                ]
            })
        );
    })