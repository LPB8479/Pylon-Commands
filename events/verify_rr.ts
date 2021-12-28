/*IMPORTANT:
This version currently works only with built in discord/unicode emojis. Custom emojis can work but need a little modification.*/

//config
const messageID = '000000000000000000';
const channelID = '000000000000000000';
const roleID = '000000000000000000';

discord.on(discord.Event.MESSAGE_REACTION_ADD, async (reaction) => {
  if (reaction.messageId == messageID) {
    if (reaction.emoji.name == '✅') {
      await reaction.member?.addRole(roleID);
      const channel = await discord.getGuildTextChannel(channelID);
      const message = await channel.getMessage(messageID);
      message.deleteReaction('✅', reaction.member.user.id.toString());
    }
  }
});
