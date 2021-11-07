new discord.command.CommandGroup({
    defaultPrefix: '&',
    additionalPrefixes: ['!'],
    mentionPrefix: true
  }).on(
  {
    filters: discord.command.filters.canManageMessages(),
    name: 'embed',
    description:
      'Send an embed using a pastebin link (Only include the paste key)'
  },
  (args) => ({
    pasteKey: args.string()
  }),
  async (message, { pasteKey }) => {
    const req = await fetch('https://pastebin.com/raw/' + pasteKey);
    const data = await req.json();
    await message.reply(new discord.Embed(data));
  }
);
