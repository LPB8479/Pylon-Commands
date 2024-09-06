import { config } from '../config/config';
function MakeEmbed(blid: string, data: JSON) {
  // make embed
  const embed = new discord.Embed();
  embed.setTitle(`Part ${blid}: ${data.name}`);
  embed.setColor(0x4f545c);
  embed.setUrl(`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${blid}#T=P`);
  embed.setThumbnail({ url: data.part_img_url });
  return embed;
}

config.commands.on(
  {
    name: 'part',
    aliases: ['partinfo'],
    description: 'Gives information about any given part',
  },
  (args) => ({ bricklink_part_id: args.text(), }),
  async (message, { bricklink_part_id }) => {
    const blid = bricklink_part_id.split(' ')[0];
    // Get data from rebrickable's api
    const parts = await fetch(
      'https://rebrickable.com/api/v3/lego/parts/?bricklink_id=' + blid,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `key ${config.api.rebrickableAPI}`,
        },
      }
    );
    try {
      const data = await parts.json();
      // send embed
      await message.reply(MakeEmbed(blid, data.results[0]));
    } catch (e) {
      await message.reply('Invalid Input');
    }
  }
);

const keyword = 'part';
discord.on('MESSAGE_CREATE', async (message) => {
  const keywordRegEx = `.+${keyword}`;
  const regEx = new RegExp(keywordRegEx, 'g');
  if (message.content.split(' ')[0].match(regEx) == null) {
    if (message.content.toLowerCase().includes(keyword)) {
      //Isolate part number from rest of message
      const wholeMessage = message.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ').toLowerCase().split(' ');
      const keywordIndex = wholeMessage.indexOf(keyword);
      const partNumIndex = keywordIndex + 1;
      const blid = wholeMessage[partNumIndex];
      // Get data from rebrickable's api
      const parts = await fetch(
        `https://rebrickable.com/api/v3/lego/parts/?bricklink_id=${blid}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `key ${config.api.rebrickableAPI}`,
          },
        }
      );
      const data = await parts.json();
      if (data.count != 0 && (parseInt(blid) > 10 || isNaN(blid) == true)) {
        await message.reply(MakeEmbed(blid, data.results[0]));
      }
    }
  }
});
