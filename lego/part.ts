import { config } from '../config/config';
function MakeEmbed(blid: string, tlgid: number, data2: JSON, data3: JSON) {
    // make embed
    var embed = new discord.Embed();
    embed.setTitle(`Part ${blid}: ${data2.name}`);
    embed.setColor(0x4f545c);
    embed.setUrl(data2.part_url);
    embed.setDescription(
        `${data2.year_from == data2.year_to
            ? data2.year_from
            : `${data2.year_from}-${data2.year_to}`
        }\nAppears in ${data3.count} ${data3.count == 1 ? 'color' : 'colors'}`
    );
    embed.setThumbnail({ url: data2.part_img_url });
    embed.addField({
        name: '​',
        value: `Bricklink ID: ${blid}\nLego ID: ${tlgid}\nBrickOwl ID: ${data2.external_ids.BrickOwl[0]}`,
        inline: true,
    });
    embed.addField({
        name: '​',
        value: `[Bricklink](https://www.bricklink.com/v2/catalog/catalogitem.page?P=${blid}#T=P)\n[Rebrickable](${data2.part_url})\n[BrickOwl](https://www.brickowl.com/catalog/${data2.external_ids.BrickOwl[0]})`,
        inline: true,
    });
    return embed;
}

config.commands.on(
    {
        name: 'part',
        aliases: ['partinfo'],
        description: 'Gives information about any given part',
    },
    (args) => ({
        bricklink_part_id: args.text(),
    }),
    async (message, { bricklink_part_id }) => {
        var input = bricklink_part_id.split(' ')[0];
        var blid = input;
        // Get data from rebrickable's api
        var parts1 = await fetch(
            'https://rebrickable.com/api/v3/lego/parts/?bricklink_id=' + blid,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `key ${config.api.rebrickableAPI}`,
                },
            }
        );
        try {
            var data1 = await parts1.json();
            var tlgid = data1.results[0].part_num; // Need this value to make other api requests
            var parts2 = await fetch(
                `https://rebrickable.com/api/v3/lego/parts/${tlgid}/?key=${config.api.rebrickableAPI}`
            );
            var data2 = await parts2.json();
            var parts3 = await fetch(
                `https://rebrickable.com/api/v3/lego/parts/${tlgid}/colors/?key=${config.api.rebrickableAPI}`
            );
            var data3 = await parts3.json();
            var embed = MakeEmbed(blid, tlgid, data2, data3);
            // send embed
            await message.reply(embed);
        } catch (e) { await message.reply('Invalid Input') }
    }
);

var keyword = 'part';
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
            //console.log(input);
            var blid = input;
            // Get data from rebrickable's api
            var parts1 = await fetch(
                `https://rebrickable.com/api/v3/lego/parts/?bricklink_id=${blid}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `key ${config.api.rebrickableAPI}`,
                    },
                }
            );
            var data1 = await parts1.json();
            if (data1.count != 0 && (parseInt(blid) > 10 || isNaN(blid) == true)) {
                var tlgid = data1.results[0].part_num; // Need this value to make other api requests
                var parts2 = await fetch(
                    `https://rebrickable.com/api/v3/lego/parts/${tlgid}/?key=${config.api.rebrickableAPI}`
                );
                var data2 = await parts2.json();
                // Parse through all data to get relevant values
                var name = data2.name;
                var url = `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${blid}#T=P`;
                var imageurl = { url: data2.part_img_url };
                // make embed
                var embed = new discord.Embed();
                embed.setTitle(`Part ${blid}: ${name}`);
                embed.setColor(0x4f545c);
                embed.setUrl(url);
                embed.setThumbnail(imageurl)
                embed.setFooter({ text: `Use &part ${blid} for more information` });
                // send embed
                await message.reply(embed);
            }
        }
    }
});
