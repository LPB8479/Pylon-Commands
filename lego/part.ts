import { config } from '../config/config';

function makeEmbed(data2: JSON, data3?: JSON, tlgid?: number) {
  // make embed
  const embed = new discord.Embed();
  embed.setColor(0x4f545c);
  embed.setThumbnail({ url: data2.part_img_url });
  if (tlgid != undefined) {
    embed.setDescription(
      `${data2.year_from == data2.year_to
        ? data2.year_from
        : `${data2.year_from}-${data2.year_to}`
      }\nAppears in ${data3.count} ${data3.count == 1 ? 'color' : 'colors'}`
    );
  }

  if (data2.external_ids.BrickLink != undefined) {
    const blid = data2.external_ids.BrickLink[0];
    embed.setTitle(`Part ${blid}: ${data2.name}`);
    embed.setUrl(`https://www.bricklink.com/v2/catalog/catalogitem.page?P=${blid}#T=P`);
  } else {
    embed.setTitle(`Part ${data2.part_num}: ${data2.name}`);
    embed.setUrl(data2.part_url);
  }

  if (tlgid != undefined) {
    let ids = "";
    let links = "";
    if (data2.external_ids.BrickLink != undefined) {
      ids += `Bricklink ID: ${data2.external_ids.BrickLink[0]}\n`;
      links += `[Bricklink](https://www.bricklink.com/v2/catalog/catalogitem.page?P=${data2.external_ids.BrickLink[0]}#T=P)\n`;
    }
    ids += `Lego ID: ${tlgid}`;
    links += `[Rebrickable](${data2.part_url})`;
    if (data2.external_ids.BrickOwl != undefined) {
      ids += `\nBrickOwl ID: ${data2.external_ids.BrickOwl[0]}`;
      links += `\n[BrickOwl](https://www.brickowl.com/catalog/${data2.external_ids.BrickOwl[0]})`
    }
    
    embed.addField({
      name: '​',
      value: ids,
      inline: true,
    });
    embed.addField({
      name: '​',
      value: links,
      inline: true,
    });
  }
  return embed;
}

config.commands.on(
  {
    name: 'part',
    aliases: ['partinfo'],
    description: 'Gives information about any given part',
  },
  (args) => ({ query_id: args.text(), }),
  async (message, { query_id }) => {
    const qid = query_id.split(' ')[0];
    // Get data from rebrickable's api
    const parts1 = await fetch(
      'https://rebrickable.com/api/v3/lego/parts/?bricklink_id=' + qid,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `key ${config.api.rebrickableAPI}`,
        },
      }
    );
    try {
      const data1 = await parts1.json();
      const tlgid = data1.results[0].part_num; // Need this value to make other api requests
      const parts2 = await fetch(
        `https://rebrickable.com/api/v3/lego/parts/${tlgid}/?key=${config.api.rebrickableAPI}`
      );
      const data2 = await parts2.json();
      const parts3 = await fetch(
        `https://rebrickable.com/api/v3/lego/parts/${tlgid}/colors/?key=${config.api.rebrickableAPI}`
      );
      const data3 = await parts3.json();
      // send embed
      await message.reply(makeEmbed(data2, data3, tlgid));
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
      const qid = wholeMessage[partNumIndex];
      // Get data from rebrickable's api
      const parts = await fetch(
        `https://rebrickable.com/api/v3/lego/parts/?bricklink_id=${qid}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `key ${config.api.rebrickableAPI}`,
          },
        }
      );
      const data = await parts.json();
      if (data.count != 0 && (parseInt(qid) > 10 || isNaN(parseInt(qid)) == true)) {
        await message.reply(makeEmbed(data.results[0]));
      }
    }
  }
});

config.legoSlash.register(
  {
    name: 'part',
    description: 'Gives information about any given part',
    options: (opt) => ({
      bricklink_part_id: opt.string('Bricklink Part ID'),
    }),
  },
  async (interaction, { bricklink_part_id }) => {
    const input = bricklink_part_id;
    const blid = input;
    // Get data from rebrickable's api
    const parts1 = await fetch(
      'https://rebrickable.com/api/v3/lego/parts/?bricklink_id=' + blid,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `key ${config.api.rebrickableAPI}`,
        },
      }
    );
    const data1 = await parts1.json();
    const tlgid = data1.results[0].part_num; // Need this value to make other api requests
    const parts2 = await fetch(
      `https://rebrickable.com/api/v3/lego/parts/${tlgid}/?key=${config.api.rebrickableAPI}`
    );
    const data2 = await parts2.json();
    const parts3 = await fetch(
      `https://rebrickable.com/api/v3/lego/parts/${tlgid}/colors/?key=${config.api.rebrickableAPI}`
    );
    const data3 = await parts3.json();
    const embed = makeEmbed(data2, data3, tlgid);
    // send embed
    await interaction.respond({
      embeds: [embed],
    });
  }
);