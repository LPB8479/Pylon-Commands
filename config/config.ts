export const config = {
  slashCommands: discord.interactions.commands,
  commands: new discord.command.CommandGroup({
    defaultPrefix: '&',
    additionalPrefixes: ['!'],
    mentionPrefix: true
  }),
  legoSlash: discord.interactions.commands.registerGroup({
    name: 'lego',
    description: 'LEGO-related commands'
  }),
  channel: {
    modpg: '000000000000000000',
    welcome: '000000000000000000',
    modlog: '000000000000000000',
    report: '000000000000000000',
    rules: '000000000000000000',
    drama: '000000000000000000'
  },
  role: {
    muteRole: '000000000000000000',
    modRole: '000000000000000000'
  },
  api: {
    rebrickableAPI: '',
    bricksetAPI: '',
    bricksetHash: ''
  },
  kv: {
    modlog: new pylon.KVNamespace('modlog'),
    drama: new pylon.KVNamespace('drama'),
    tempmute: new pylon.KVNamespace('tempmute')
  }
};
