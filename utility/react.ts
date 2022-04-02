import { config } from '../config/config'
//Usage: [p]react <channel> <message id> <emoji>
config.commands.on(
  {
    filters: discord.command.filters.canManageMessages(),
    name: 'react',
    description: 'Add a reaction to a message. Useful for setting up reaction roles'
  },
  (args) => ({
    channel: args.guildTextChannel(),
    messageID: args.string(),
    emoji: args.string()
  }),
  async (message, { channel, messageID, emoji }) => {
    const messageObject = await channel.getMessage(messageID)
    var cleanEmoji = emoji.replace('<:', '').replace('>', '')
    try {
      await messageObject?.addReaction(cleanEmoji);
      await message.addReaction(`✅`)
    } catch (err) {
      await message.reply(
        `❌ Invalid Input. Make sure I am in the server containing \`${emoji}\`.`
      );
    }
  }
)