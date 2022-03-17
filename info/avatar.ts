import { config } from '../config/config';

config.commands.on(
    {
        name: 'avatar',
        aliases: ['av'],
        description: "Get a member's avatar in various formats"
    },
    (args) => ({
        member: args.guildMemberOptional()
    }),
    async (message, { member }) => {
        var mem = (member == null) ? message.member : member
        var largeImage = `${mem.user.getAvatarUrl(discord.ImageType.PNG)}?size=1024`
        await message.reply(
            new discord.Embed({
                color: 0x758ad7,
                title: `Avatar for ${mem.user.getTag()}`,
                image: { url: largeImage },
                fields: [
                    {
                        inline: true,
                        name: `Link as`,
                        value: `[png](${mem.user.getAvatarUrl(discord.ImageType.PNG)}) | [jpg](${mem.user.getAvatarUrl(discord.ImageType.JPEG)}) | [webp](${mem.user.getAvatarUrl(discord.ImageType.WEBP)})`
                    }
                ]
            })
        );
    })