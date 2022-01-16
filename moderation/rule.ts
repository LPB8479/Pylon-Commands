import { config } from '../config/config';
import { rulesconfig } from '../config/rulesconfig';
async function makeEmbed(title: string, full: string) {
  const guild = await discord.getGuild();
  var ruleChannel = await discord.getGuildTextChannel(rulesconfig.config.ruleschannel);
  var embed = new discord.Embed()
    .setAuthor({
      name: guild.name,
      iconUrl: guild.getIconUrl()
    })
    .setColor(0x4f545c)
    .setDescription(ruleChannel?.toMention())
    .addField({
      inline: false,
      name: title,
      value: full
    });
  return embed;
}

//Usage: [p][rule|rules] [keyword|rule number]
config.commands.on(
  {
    name: 'rule',
    aliases: ['rules'],
    description: 'Display server rules'
  },
  (args) => ({
    input: args.textOptional()
  }),
  async (message, { input }) => {
    const guild = await discord.getGuild();
    var firstKeywordArray: any[] = [];
    var fullKeywordArray: any[] = [];
    rulesconfig.rules.forEach((keywordCheck) => {
      if (keywordCheck.keywordString != '') {
        var firstKey = keywordCheck.keywordString.split(' ')[0];
        firstKeywordArray.push(firstKey);
        fullKeywordArray.push(keywordCheck.keywordString);
      }
    });
    if (input == '' || input == null) {
      await message.reply(makeEmbed(`Rules Command Instructions`, `Follow \`&rule\` with the number or corresponding keyword of the rules you wish to output.\n\n**__${guild.name}'s Keywords:__**\n${`\`${firstKeywordArray.toString().replace(/,/g, '`, `')}\``}`));
    } else {
      var inputSplit = input.toLowerCase().split(' ');
      inputSplit.forEach(async (keyword) => {
        if (parseInt(keyword) != NaN && parseInt(keyword) <= firstKeywordArray.length) {
          var ruleNum = parseInt(keyword) - 1;
          var ruleText = rulesconfig.rules[ruleNum].text;
          var ruleTitle = rulesconfig.rules[ruleNum].title;
          await message.reply(makeEmbed(ruleTitle, ruleText));
        } else if (fullKeywordArray.toString().includes(keyword.toLowerCase())) {
          var keywordSearch = 0
          while (keywordSearch < 20) {
            if (rulesconfig.rules[keywordSearch].keywordString.includes(keyword.toLowerCase())) {
              var ruleText = rulesconfig.rules[keywordSearch].text;
              var ruleTitle = rulesconfig.rules[keywordSearch].title;
              await message.reply(makeEmbed(ruleTitle, ruleText));
              break
            }
             else {keywordSearch += 1}
          }
        } else {
          await message.reply(makeEmbed(`Rules Command Instructions`, `Follow \`&rule\` with the number or corresponding keyword of the rules you wish to output.\n\n**__${guild.name}'s Keywords:__**\n${`\`${firstKeywordArray.toString().replace(/,/g, '`, `')}\``}`));
        }
      });
    }
  }
);