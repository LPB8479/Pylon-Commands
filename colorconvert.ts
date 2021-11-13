import { config } from '../config';

config.commands.on(
  {
    name: 'convert',
    aliases: ['convert', 'color', 'clr'],
    description: 'Convert between different color formats'
  },
  (args) => ({
    color_format: args.stringOptional(),
    color_value: args.textOptional()
  }),
  async (message, { color_format, color_value }) => {
    // Sanitize & standardize input
    if (color_format == null) {
      var searchType = 'hex';
      var searchParam = Math.floor(Math.random()*16777215).toString(16);
    }
    else {
    if (color_value == null) {
      if (color_format.includes('#')) {
        var searchType = 'hex';
        var searchParam = color_format.replace(/[#]+/g, '');
      } else {
        if (color_format.includes('(')) {
          var split = color_format.split('(');
          var searchType = split[0];
          var searchParam = '(' + split[1];
        } else {
          var searchType = 'hex';
          var searchParam = color_format;
        }
      }
    } else {
      if (color_format.includes('(')) {
        var allArgs = color_format + ' ' + color_value;
        var noSpace = allArgs.replace(/\s+/g, '');
        var split = noSpace.split('(');
        var searchType = split[0];
        var searchParam = '(' + split[1];
      } else {
        var searchType = color_format;
        var searchParam = color_value.replace(/\s+/g, '');
      }
    }}
    // Make API request
    const requrl = `https://www.thecolorapi.com/id?&${searchType}=${searchParam}`;
    const req = await fetch(requrl);
    const data = await req.json();
    // parse api request
    const hexDisp = data.hex.value;
    const hexNumber = data.hex.clean;
    const rgb = data.rgb.value;
    const red = data.rgb.r;
    const green = data.rgb.g;
    const blue = data.rgb.b;
    const hsl = data.hsl.value;
    const hsv = data.hsv.value;
    const name = data.name.value;
    const cmyk = data.cmyk.value;
    const imageUrl = `https://res.cloudinary.com/demo/image/upload/w_150,h_200,e_colorize,co_rgb:${hexNumber}/one_pixel.jpg`;
    const decimal = parseInt(hexNumber, 16);
    const infoUrl = `https://encycolorpedia.com/${hexNumber}`;
    // Get information about opposite color
    const invRed = 255 - red;
    const invGreen = 255 - green;
    const invBlue = 255 - blue;
    const invRequrl = `https://www.thecolorapi.com/id?rgb=${invRed},${invGreen},${invBlue}`;
    const invReq = await fetch(invRequrl);
    const invData = await invReq.json();
    // Parse opposite color info
    const invHexDisp = invData.hex.value;
    const invHexNumber = invData.hex.clean;
    const invRgb = invData.rgb.value;
    const invHsl = invData.hsl.value;
    const invHsv = invData.hsv.value;
    const invName = invData.name.value;
    const invCmyk = invData.cmyk.value;
    const invImageUrl = `https://res.cloudinary.com/demo/image/upload/w_350,h_50,e_colorize,co_rgb:${invHexNumber}/one_pixel.jpg`;
    const invDecimal = parseInt(invHexNumber, 16);
    const invInfoUrl = `https://encycolorpedia.com/${invHexNumber}`;
    if (rgb.includes('NaN')) {
      message.reply(
        'Invalid Input. Please format your query as `&convert <color_format> <color_value>`. Valid color formats are `hex`, `rgb`, `hsl`, and `cmyk`.'
      );
    } else {
      // Make embed
      var embed = new discord.Embed();
      embed.setColor(decimal);
      embed.setDescription(
        `**[Color Information](${infoUrl})**\nName: \`${name}\`\nHex: \`${hexDisp}\`\nRGB: \`${rgb}\`\nHSL: \`${hsl}\`\nHSV: \`${hsv}\`\nCMYK: \`${cmyk}\`\nDecimal: \`${decimal}\`\n\n**[Complimentary Color](${invInfoUrl})**\nName: \`${invName}\`\nHex: \`${invHexDisp}\`\nRGB: \`${invRgb}\`\nHSL: \`${invHsl}\`\nHSV: \`${invHsv}\`\nCMYK: \`${invCmyk}\`\nDecimal: \`${invDecimal}\``
      );
      embed.setThumbnail({ url: imageUrl });
      embed.setImage({ url: invImageUrl });
      embed.setFooter({
        text: 'powered by https://www.thecolorapi.com/'
      });
      // Send Embed
      await message.reply(embed);
    }
  }
);
