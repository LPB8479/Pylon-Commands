import { config } from '../config';

config.commands.on(
  {
    filters: discord.command.filters.canManageChannels(),
    name: 'clonechannel',
    description: 'Create a channel with permissions copied from another channel'
  },
  (args) => ({
    baseChannel: args.guildChannel(),
    channelName: args.text()
  }),
  async (message, { baseChannel, channelName }) => {
    const perms = baseChannel.permissionOverwrites;
    const parent = baseChannel.parentId;
    const server = await message.getGuild();
    await server.createChannel({
      name: channelName,
      permissionOverwrites: perms,
      parentId: parent
    });
  }
);
