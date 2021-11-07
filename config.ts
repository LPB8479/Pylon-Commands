export const config = {
  slashCommands: discord.interactions.commands,
  commands: new discord.command.CommandGroup({
    defaultPrefix: '&',
    additionalPrefixes: ['!'],
    mentionPrefix: true
  })
};
