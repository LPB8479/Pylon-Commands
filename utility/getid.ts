import { config } from '../config/config';
//Usage: [p]getid <input string>
config.commands.on(
  {
    name: 'getid',
    description: 'Get the id of a user, role, channel, or emoji'
  },
  (args) => ({
    input: args.text()
  }),
  async (message, { input }) => {
    const spaceIn = input.replace(`><`, `> <`).split(' ')
    var output = []
    for (var itemCount = 0; itemCount < spaceIn.length; itemCount++) {
      var emojiRep = spaceIn[itemCount].replace('<a:', '').replace('<:', '').replace('>', '')
      var userRoleRep = spaceIn[itemCount].replace('!', '').replace('<@', '').replace('>', '')
      var channelRep = spaceIn[itemCount].replace('<#', '').replace('>', '');
      (spaceIn[itemCount].startsWith('<a:') || spaceIn[itemCount].startsWith('<:')) ? output.push(emojiRep) : spaceIn[itemCount].startsWith('<@') ? output.push(userRoleRep) : spaceIn[itemCount].startsWith('<#') ? output.push(channelRep) : output.push('Invalid input');
      if (itemCount + 1 < spaceIn.length) {
        output.push('\n')
      }
    }
    message.reply(output.toString().replaceAll(',', ''))
  }
);
