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
            if ('idusage'.includes(largs)) {
                var pastebin = 'JhzhQChy';
            } else {
                if ('report'.includes(largs)) {
                    var pastebin = '3nPKuE30';
                } else {
                    if ('markdown_mkdn_formatting_fmt'.includes(largs)) {
                        var pastebin = '6rCiB6zK';
                    } else {
                        var pastebin = 'Rwz180j2';
                    }
                }
            }
        } else {
            var pastebin = 'Rwz180j2';
        }
        const req = await fetch('https://pastebin.com/raw/' + pastebin);
        const data = await req.json();
        await message.reply(new discord.Embed(data));
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
        if ('idusage'.includes(largs)) {
            var pastebin = 'JhzhQChy';
        } else {
            if ('report'.includes(largs)) {
                var pastebin = '3nPKuE30';
            } else {
                if ('markdown_mkdn_formatting_fmt'.includes(largs)) {
                    var pastebin = '6rCiB6zK';
                } else {
                    var pastebin = 'Rwz180j2';
                }
            }
        }
        const req = await fetch('https://pastebin.com/raw/' + pastebin);
        const data = await req.json();
        await interaction.respond({
            embeds: [new discord.Embed(data)]
        });
    }

);
