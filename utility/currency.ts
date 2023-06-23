import { config } from '../config/config';

config.commands.on(
    {
        name: 'currency',
        description: 'Convert between currencies'
    },
    (args) => ({
        from: args.string(),
        to: args.string(),
        amtIn: args.numberOptional()
    }),
    async (message, { from, to, amtIn }) => {
        var fromCap = from.toUpperCase();
        var toCap = to.toUpperCase();

        var rateReq = await fetch(`https://api.exchangerate.host/convert?from=${fromCap}&to=${toCap}`);
        var rateData = await rateReq.json();
        var rate: number = rateData.result;

        var symbReq = await fetch(`https://gist.githubusercontent.com/ksafranski/2973986/raw/5fda5e87189b066e11c1bf80bbfbecb556cf2cc1/Common-Currency.json`);
        var symbData = await symbReq.json();
        var symbFrom = symbData[fromCap].symbol_native;
        var symbTo = symbData[toCap].symbol_native;

        var amtFrom = (amtIn == null) ? 1 : amtIn;
        var amtTo = amtFrom * rate;

        // make embed
        var embed = new discord.Embed()
            .setTitle(`Currency Conversion: **${fromCap}** to **${toCap}**`)
            .setColor(0x9cff1d)
            .setDescription(`The conversion rate between \`${fromCap}\` and \`${toCap}\` is \`${rate}\`.\n\n\`${symbFrom}${amtFrom} ${fromCap}\` is equal to \`${symbTo}${amtTo} ${toCap}\`.`);
        // send embed
        await message.reply({ content: '', embed: embed });
    }
);