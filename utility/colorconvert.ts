import { config } from '../config/config';
//Usage: [p][convert|color|clr] [color format] [color value]
function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}


config.commands.on(
  {
    name: 'convert',
    aliases: ['color', 'clr', 'colorconvert'],
    description: 'Convert between different color formats'
  },
  (args) => ({
    color_format: args.stringOptional(),
    color_value: args.textOptional()
  }),
  async (message, { color_format, color_value }) => {
    if (color_format == 'avg' || color_format == 'av' || color_format == 'average') {
      if (color_value.split(' ').length > 1 && color_value.replace(/[#]+/g, '').replace(/\s+/g, '').split('').length % 6 == 0) {
        var hex = color_value.replace(/[#]+/g, '').split(' ')
        var count = hex.length
        var red = []
        var green = []
        var blue = []
        var overlayString = ''
        hex.forEach((clr, arrCount) => {
          var rgb = hexToRgb(clr)
          red.push(parseInt(rgb[0]))
          green.push(parseInt(rgb[1]))
          blue.push(parseInt(rgb[2]))
          overlayString += `/l_one_pixel.jpg/w_${Math.round(200 / count)},h_100,e_colorize,co_rgb:${clr}/fl_layer_apply,g_north_west,x_${(Math.round(200 / count)) * (arrCount)}`
        })
        var redSum = red.reduce((partialSum, a) => partialSum + a, 0)
        var greenSum = green.reduce((partialSum, a) => partialSum + a, 0)
        var blueSum = blue.reduce((partialSum, a) => partialSum + a, 0)
        var redAvg = Math.round(redSum / count)
        var greenAvg = Math.round(greenSum / count)
        var blueAvg = Math.round(blueSum / count)
        var result = rgbToHex(redAvg, greenAvg, blueAvg)
        //make embed
        var imgUrl = `https://res.cloudinary.com/demo/image/upload/w_200,h_200,e_colorize,co_rgb:${result}${overlayString}/one_pixel.jpg`
        var embed = new discord.Embed();
        embed.setColor(parseInt(result, 16))
        embed.setThumbnail({ url: imgUrl });
        embed.setTitle(`Color merger`)
        embed.setDescription(`Input: \`${hex.toString()}\`\nOutput: \`#${result}\`\nMore info:\n\`\`\`&clr #${result}\`\`\``)
        message.reply(embed)
      } else {
        message.reply('Invalid input. Please use at least two valid hex codes.')
      }
    } else {
      // Sanitize & standardize input
      if (color_format == null) {
        var searchType = 'hex';
        var searchParam = Math.floor(Math.random() * 16777215).toString(16);
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
        }
      }
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
      const binary = (parseInt(hexNumber, 16).toString(2)).padStart(8, '0')
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
      const invBinary = (parseInt(invHexNumber, 16).toString(2)).padStart(8, '0')
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
          `**[Color Information](${infoUrl})**\nName: \`${name}\`\nHex: \`${hexDisp}\`\nRGB: \`${rgb}\`\nHSL: \`${hsl}\`\nHSV: \`${hsv}\`\nCMYK: \`${cmyk}\`\nDecimal: \`${decimal}\`\nBinary: \`${binary}\`\n\n**[Complimentary Color](${invInfoUrl})**\nName: \`${invName}\`\nHex: \`${invHexDisp}\`\nRGB: \`${invRgb}\`\nHSL: \`${invHsl}\`\nHSV: \`${invHsv}\`\nCMYK: \`${invCmyk}\`\nDecimal: \`${invDecimal}\`\nBinary: \`${invBinary}\``
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
  }
);