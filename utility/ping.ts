import { config } from '../config/config';

config.commands.raw(
  {
    name: 'ping',
    description: 'Pong!'
  },
  async (message) => {
    const snowflake = BigInt(message.id);
    const now = Date.now();
    const snowflakeTimestamp = Number(
      (snowflake >> BigInt(22)) + BigInt(1420070400000)
    );
    await message.reply(`Pong! (${now - snowflakeTimestamp}ms)`);
  }
);

config.slashCommands.register(
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  async (interaction) => {
    const snowflake = BigInt(interaction.id);
    const now = Date.now();
    const snowflakeTimestamp = Number(
      (snowflake >> BigInt(22)) + BigInt(1420070400000)
    );
    await interaction.respond(`Pong! (${now - snowflakeTimestamp}ms)`);
  }
);
