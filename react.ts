import { config } from '../config';

config.commands.on(
  {
    filters: discord.command.filters.canManageMessages(),
    name: 'react',
    description: 'Add reactions to a message'
  },
  (args) => ({
    channel: args.guildTextChannel(),
    messageID: args.string(),
    emoji: args.text()
  }),
  async (message, { channel, messageID, emoji }) => {
    const messageObject = await channel.getMessage(messageID);
    const emojiArray = emoji.split(' ');
    for (let step = 0; step < emojiArray.length; step++) {
      // For each emoji:
      try {
        var emojiRaw = emojiArray[step].replace('<:', '').replace('>', '');
        await messageObject!.addReaction(emojiRaw);
        await message.addReaction(':white_check_mark:');
      } catch (err) {
        await message.reply(
          `Invalid Input. Make sure I am in the server containing \`${emojiArray[step]}\`.`
        );
      }
    }
  }
);
