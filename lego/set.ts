import { config } from '../config/config';
function parseAndEmbed(data: JSON, set_number: string) {
  var setObj = data.sets[0];
  var dash = setObj.name.replace(/\s+/g, '-').toLowerCase();
  var embed = new discord.Embed()
    .setTitle(`Set #${set_number}: ${setObj.name} [${setObj.theme}]`)
    .setUrl(
      `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set_number}`
    )
    .setColor(0x4f545c)
    .setThumbnail({ url: setObj.image.imageURL })
    .setDescription(`Released ${setObj.year}\n${setObj.pieces} pieces`)
    .setFields([
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
    var set_number = set_number.includes('-') ? set_number : `${set_number}-1`;
    // Get data from brickset's api
    var req = await fetch(
      `https://brickset.com/api/v3.asmx/getSets?apiKey=${config.api.bricksetAPI}&userHash=${config.api.bricksetHash}&params=%7B%27setNumber%27%3A%27${set_number}%27%7D`
    );
    var data = await req.json();
    var embed = parseAndEmbed(data, set_number);
    // send embed
    await message.reply({ content: '', embed: embed });
  }
);

var keyword = 'set';
discord.on('MESSAGE_CREATE', async (message) => {
  var keywordRegEx = `.+${keyword}`;
  var regEx = new RegExp(keywordRegEx, 'g');
  if (message.content.split(' ')[0].match(regEx) == null) {
    if (message.content.toLowerCase().includes(keyword)) {
      //Isolate part number from rest of message
      var wholeMessage = message.content
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s{2,}/g, ' ')
        .toLowerCase();
      var messageArray = wholeMessage.split(' ');
      var keywordIndex = messageArray.indexOf(keyword);
      var partNumIndex = keywordIndex + 1;
      var input = messageArray[partNumIndex];
      var set_number = input.includes('-') ? input : `${input}-1`;
      // Get data from brickset's api
      var req = await fetch(
        `https://brickset.com/api/v3.asmx/getSets?apiKey=${config.api.bricksetAPI}&userHash=${config.api.bricksetHash}&params=%7B%27setNumber%27%3A%27${set_number}%27%7D`
      );
      var data = await req.json();
      if (data.matches != 0) {
        // parse json api response
        var setname = data.sets[0].name;
        var theme = data.sets[0].theme;
        var imageurl = { url: data.sets[0].image.imageURL };
        // make embed
        var embed = new discord.Embed()
          .setTitle(`Set #${set_number}: ${setname} [${theme}]`)
          .setColor(0x4f545c)
          .setThumbnail(imageurl)
          .setUrl(
            `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${set_number}`
          );
        // send embed
        await message.reply({ content: '', embed: embed });
      }
    }
  }
});
