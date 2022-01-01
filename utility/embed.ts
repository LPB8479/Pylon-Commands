import { config } from '../config/config';
//Usage: [p]embed <channel> <color> <title|description>
config.commands.on(
  {
  name: 'embed',
  description: 'Send a simple embed',
  filters: discord.command.filters.canManageMessages()
  //  filters: discord.command.filters.hasRole(config.role.modRole)
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
