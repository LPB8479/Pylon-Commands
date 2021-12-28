import { config } from '../config/config';
//Usage: [p]embedsource <message id> [channel]
config.commands.on(
    {
        name: 'embedsource',
        description: 'Get the raw json from any embed'
    },
    (args) => ({
        messageID: args.string(),
        channel: args.guildTextChannelOptional()
    }),
    async (message, { messageID, channel }) => {
        var basechannel = channel == null ? await message.getChannel() : await discord.getGuildTextChannel(channel.id)
        var targetMessage = await basechannel?.getMessage(messageID);
        const embeds = targetMessage?.embeds.map((e) => {
            return e.serialize();
          });
          await message.reply('```' + JSON.stringify(embeds, null, 2) + '```');
    }
);
