export const config = {
  slashCommands: discord.interactions.commands,
  commands: new discord.command.CommandGroup({
    defaultPrefix: '&',
    additionalPrefixes: ['!'],
    mentionPrefix: true
  }),
  channel: {
    welcome: '000000000000000000',
    modlog: '000000000000000000'
  },
  kv: {
    modlog: new pylon.KVNamespace('modlog')
  }
};
