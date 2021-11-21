import { config } from '../config/config';

config.commands.on(
  {
    filters: discord.command.filters.canManageMessages(),
    name: 'embed',
    description: 'Send a simple embed'
  },
  (args) => ({
    channel: args.guildTextChannel(),
    color: args.string(),
    content: args.text()
  }),
  async (message, { channel, color, content }) => {
    const contentArray = content.split('|');
    const colorVal = parseInt(color.replace('#', ''), 16);
    await channel.sendMessage(
      new discord.Embed({
        title: contentArray[0],
        description: contentArray[1],
        color: colorVal
      })
    );
  }
);
