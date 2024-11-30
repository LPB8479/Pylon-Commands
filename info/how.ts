import { config } from '../config/config';

config.commands.on(
    {
        name: 'how',
        aliases: ['faq'],
        description:
            'Get information about how to use Discord, the server, and server bots'
    },
    (args) => ({
        keyword: args.textOptional()
    }),
    async (message, { keyword }) => {
        if (keyword) {
            const largs = keyword.toLowerCase();
            let pastebin;
            switch (largs) {
                case 'idusage':
                    pastebin = 'JhzhQChy';
                    break;
                case 'report':
                    pastebin = '3nPKuE30';
                    break;
                case 'markdown':
                case 'mkdn':
                case 'formatting':
                case 'format':
                case 'fmt':
                    pastebin = '6rCiB6zK';
                    break;
                default:
                    pastebin = 'Rwz180j2'
            }
            const req = await fetch('https://pastebin.com/raw/' + pastebin);
            const data = await req.json();
            await message.reply(new discord.Embed(data));
        }
    }
);

config.slashCommands.register(
    {
        name: 'how',
        description:
            'Get information about how to use Discord, the server, and server bots',
        options: (opt) => ({
            keyword: opt.string('Keyword')
        })
    },
    async (interaction, { keyword }) => {
        const largs = keyword.toLowerCase();
        let pastebin;
        switch (largs) {
            case 'idusage':
                pastebin = 'JhzhQChy';
                break;
            case 'report':
                pastebin = '3nPKuE30';
                break;
            case 'markdown':
            case 'mkdn':
            case 'formatting':
            case 'format':
            case 'fmt':
                pastebin = '6rCiB6zK';
                break;
            default:
                pastebin = 'Rwz180j2'
        }
        const req = await fetch('https://pastebin.com/raw/' + pastebin);
        const data = await req.json();
        await interaction.respond({
            embeds: [new discord.Embed(data)]
        });
    }

);
