import { config } from '../config/config';
function parseAndEmbed(full: boolean, data: JSON, set_number: string) {
  const setObj = data.sets[0];
  const dash = setObj.name.replace(/\s+/g, '-').toLowerCase();
  const embed = new discord.Embed()
  embed.setTitle(`Set #${set_number}: ${setObj.name} [${setObj.theme}]`)
  embed.setUrl(`https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set_number}`)
  embed.setColor(0x4f545c)
  embed.setThumbnail({ url: setObj.image.imageURL })
  if (full) {
    embed.setDescription(`Released ${setObj.year}\n${setObj.pieces} pieces`)
    embed.setFields([
      {
        name: '​',
        value: `[Bricklink](https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set_number})\n[Brickset](https://brickset.com/sets/${set_number})`,
        inline: true,
      },
      {
        name: '​',
        value: `[Brick Owl](https://www.brickowl.com/search/catalog?query=${set_number}&cat=3)\n[Rebrickable](https://rebrickable.com/sets/${set_number}/${dash})`,
        inline: true,
      },
    ]);
  }
  return embed;
}

config.commands.on(
  {
    name: 'set',
    aliases: ['setinfo'],
    description: 'Gives information about any given set',
  },
  (args) => ({
    set_number: args.string(),
  }),
  async (message, { set_number }) => {
    const set_id = set_number.includes('-') ? set_number : `${set_number}-1`;
    // Get data from brickset's api
    const req = await fetch(`https://brickset.com/api/v3.asmx/getSets?apiKey=${config.api.bricksetAPI}&userHash=${config.api.bricksetHash}&params=%7B%27setNumber%27%3A%27${set_id}%27%7D`);
    const data = await req.json();
    try {
      // send embed
      await message.reply(parseAndEmbed(true, data, set_id));
    } catch (e) {
      await message.reply('Invalid Input')
    }
  }
);

const keyword = 'set';
discord.on('MESSAGE_CREATE', async (message) => {
  const keywordRegEx = `.+${keyword}`;
  const regEx = new RegExp(keywordRegEx, 'g');
  if (message.content.split(' ')[0].match(regEx) == null) {
    if (message.content.toLowerCase().includes(keyword)) {
      //Isolate part number from rest of message
      const wholeMessage = message.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ').toLowerCase().split(' ');
      const keywordIndex = wholeMessage.indexOf(keyword);
      const partNumIndex = keywordIndex + 1;
      const input = wholeMessage[partNumIndex];
      const set_number = input.includes('-') ? input : `${input}-1`;
      // Get data from brickset's api
      const req = await fetch(`https://brickset.com/api/v3.asmx/getSets?apiKey=${config.api.bricksetAPI}&userHash=${config.api.bricksetHash}&params=%7B%27setNumber%27%3A%27${set_number}%27%7D`);
      const data = await req.json();
      if (data.matches != 0) await message.reply(parseAndEmbed(false, data, set_number))
    }
  }
}
);

config.legoSlash.register(
  {
    name: 'set',
    description: 'Gives information about any given set',
    options: (opt) => ({
      set_number: opt.string('Set number'),
    }),
  },
  async (interaction, { set_number }) => {
    const setNumber = set_number.includes('-') ? set_number : `${set_number}-1`;
    // Get data from brickset's api
    const req = await fetch(
      `https://brickset.com/api/v3.asmx/getSets?apiKey=${config.api.bricksetAPI}&userHash=${config.api.bricksetHash}&params=%7B%27setNumber%27%3A%27${setNumber}%27%7D`
    );
    const data = await req.json();
    const embed = parseAndEmbed(true, data, setNumber);
    // send embed
    await interaction.respond({
      embeds: [embed],
    });
  }
);
