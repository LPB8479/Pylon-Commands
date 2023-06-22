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
        var req = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`);
        var data = await req.json();
        var rate = data.result;
    }
);