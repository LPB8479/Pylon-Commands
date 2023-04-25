import { config } from '../config/config';
var items = [
  'Did you really think that would work?',
  'Imagine trying to run this command as a normal member <a:mock:893542496599167046>',
  'Nice try'
];
const F = discord.command.filters;

config.commands.on(
  {
    name: 'verify',
    filters: F.withCustomMessage(
      F.hasRole(config.role.modRole),
      items[Math.floor(Math.random() * items.length)]
    ),
    description: 'Verify members'
  },
  (args) => ({
    target: args.guildMember()
  }),
  async (message, { target }) => {
    message.delete();
    if (
      target.roles.includes(config.role.unverified) &&
      target.pending == false
    ) {
      await target.removeRole(config.role.unverified);
      await target.addRole(config.role.verified);
      message.reply(
        'Welcome, <@!' +
          target.user.id +
          '>! You have been verified and should now have access to the other channels. Thanks for joining!'
      );
    } else {
      const modChannel = await discord.getGuildTextChannel(
        config.channel.modpg
      );
      await modChannel.sendMessage(
        'The member needs to agree to the server rules before they can be verified'
      );
    }
  }
);

config.slashCommands.register(
  {
    name: 'verify',
    description: 'Verify members',
    options: (opt) => ({
      target: opt.guildMember('member')
    })
  },
  async (interaction, { target }) => {
    if (
      interaction.member.roles.includes(config.role.modRole) ||
      target.pending == false
    ) {
      if (target.roles.includes(config.role.unverified)) {
        await target.removeRole(config.role.unverified);
        await target.addRole(config.role.verified);
        await interaction.respond(
          'Welcome, <@!' +
            target.user.id +
            '>! You have been verified and should now have access to the other channels. Thanks for joining!'
        );
      } else {
        await interaction.respondEphemeral(
          'The member needs to agree to the server rules before they can be verified'
        );
      }
    } else {
      await interaction.respondEphemeral(
        items[Math.floor(Math.random() * items.length)]
      );
    }
  }
);
