import { config } from '../config/config'
/*Usage: [p]addemoji <emoji name> <emoji url>
         [p]addemoji color <emoji name> <color>*/
config.commands.subcommand(
  {
    name: 'addemoji',
    description: 'Add server emoji',
    filters: discord.command.filters.canManageEmojis()
  },
  (subcommand) => {
    subcommand.on(
      'color',
      (args) => ({
        emojiName: args.string(),
        hex: args.string()
      }),
      async (message, { emojiName, hex }) => {
        const guild = await message.getGuild()
        try {
          if (emojiName.length == 1) { throw ('❌ Emoji names must be at least two characters') }
          if (((await message.getChannel()).canMember(await (guild.getMember(discord.getBotId())), discord.Permissions.MANAGE_EMOJIS)) == false) { throw ('⚠️ Missing permission: Manage_Emojis')}
          const color = hex.replace('#', '').toLowerCase
          const emoji = `https://res.cloudinary.com/demo/w_150,h_150/c_fill,r_max/e_colorize:100,co_rgb:${color}'/one_pixel.png`
          await guild.createEmoji({
            image: await fetch(emoji).then((x) => x.arrayBuffer()),
            name: emojiName
          })
          await message.reply('Success!')
        }
        catch (err) {
          await message.reply(err)
        }
      }
    )

    subcommand.default(
      (args) => ({
        emojiName: args.string(),
        emojiUrl: args.string()
      }),
      async (message, { emojiName, emojiUrl }) => {
        const guild = await message.getGuild()
        try {
          if (emojiName.length == 1) { throw ('❌ Emoji names must be at least two characters') }
          if (((await message.getChannel()).canMember(await (guild.getMember(discord.getBotId())), discord.Permissions.MANAGE_EMOJIS)) == false) { throw ('⚠️ Missing permission: Manage_Emojis')}
          await guild.createEmoji({
            image: await fetch(emojiUrl).then((x) => x.arrayBuffer()),
            name: emojiName
          })
          await message.reply('Success!')
        }
        catch (err) {
          await message.reply(err)
        }
      }
    )
  }
)
