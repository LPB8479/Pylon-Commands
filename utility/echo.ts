import { config } from '../config/config';
//Usage: [p]echo [channel] <message>
config.commands.on(
  {
    name: 'echo',
    aliases: ['repeat'],
    filters: discord.command.filters.canManageMessages(),
    description: 'Get the bot to repeat whatever you say'
  },
  (args) => ({
    input: args.text()
  }),
  async (message, { input }) => {
    // Send a message
    var messageArray = input
      .replace('<#', '')
      .replace('>', '')
      .split(' ');
    var indexOfSpace = input.indexOf(' ');
    var destChannel =
      input.includes('#') == true
        ? await discord.getGuildTextChannel(messageArray[0].toString())
        : await message.getChannel();
    await destChannel?.sendMessage({
      content: `${input.includes('#') ? input.substring(indexOfSpace + 1) : input}`,
      allowedMentions: {} // Don't allow this message to ping anyone
    });
  }
);
