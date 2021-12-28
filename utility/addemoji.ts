import { config } from '../config/config';
async function urlToArrayBuffer(url: string) {
  const emoji = await (await fetch(url)).arrayBuffer();
  return emoji;
}
/*Usage: [p]addemoji <emoji name> <emoji url>
         [p]addemoji color <color>*/
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
        const color = hex.replace('#', '').toLowerCase;
        const emoji = urlToArrayBuffer(`https://res.cloudinary.com/demo/w_150,h_150/c_fill,r_max/e_colorize,co_rgb:${color}'/one_pixel.png`);
        const guild = await message.getGuild();
        await guild.createEmoji({
          image: emoji,
          name: emojiName
        });
        message.reply('Success!');
      }
    );

    subcommand.default(
      (args) => ({
        emojiName: args.string(),
        emojiUrl: args.string()
      }),
      async (message, { emojiName, emojiUrl }) => {
        const emoji = urlToArrayBuffer(emojiUrl);
        const guild = await message.getGuild();
        await guild.createEmoji({
          image: emoji,
          name: emojiName
        });
        message.reply('Success!');
      }
    );
  }
);
