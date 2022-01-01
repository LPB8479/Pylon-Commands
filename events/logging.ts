import { logConfig } from '../config/logconfig';
import { decimalToHex } from '../functions/decimalToHex';
import { convertIDtoUnix } from '../functions/convertIDtoUnix';
import { timeDelta } from '../functions/timeDelta'

type MessageChannel = discord.GuildTextChannel | discord.GuildNewsChannel;
//FUNCTIONS
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function bitfieldToArray(bitfield: number) {
  const permissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_ANALYTICS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'CHANGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
  ];
  return permissions.filter((_, i) => {
    const current = 1 << i;
    return (bitfield & current) === current;
  });
}
function removeArrayOverlap(arr1: any[], arr2: any[]) {
  let difference = arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)));
  return difference;
}
export function capitalizeWords(s: string) {
  return s.replace(/(^|[ ])./g, (e) => e.toUpperCase());
}
export function makePermissionDiff(newPermissions: number, oldPermissions: number) {
  // i can barely read this code lol
  return {
    added: bitfieldToArray(newPermissions).filter((e) => !bitfieldToArray(oldPermissions).includes(e)).map((e) => `+ ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`),
    removed: bitfieldToArray(oldPermissions).filter((e) => !bitfieldToArray(newPermissions).includes(e)).map((e) => `- ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`)
  };
}
function ord(number: number) {
  // If the provided argument is not a number, return "NaN"
  if (isNaN(number)) return 'NaN';

  // Stores the last digit of the provided number
  var numberStr = number.toString();
  let numArr = numberStr.split('');
  let lastDigit = Number(numArr[numArr.length - 1]);
  var numberNum = Number(number);

  // Constant variables
  const numbers = [1, 2, 3];
  const exceptions = [11, 12, 13];
  const letters = ['st', 'nd', 'rd', 'th'];
  const defaultLetter = letters[letters.length - 1];

  let lastDigitIndex = numbers.indexOf(lastDigit);
  // Stores the final abbreviation based on conditions. Uses the ternary operator(s)
  let finalAbbr = exceptions.includes(numberNum) ? defaultLetter : numbers[lastDigitIndex] ? letters[lastDigitIndex] : defaultLetter;
  // Formats and returns the number and its final abbreviation
  let finalOrd = numberNum + finalAbbr;
  return finalOrd;
}

//MEMBER JOIN LOGS
discord.on(discord.Event.GUILD_MEMBER_ADD, async (user) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.joinLeaveLogChannelID))!;
  const guild = await discord.getGuild();
  const members = guild.memberCount;
  if (logConfig.joinLeaveLogToggle.memberJoin == true) {
    await channel?.sendMessage(
      new discord.Embed({
        title: `Member joined`,
        description: `${user.toMention} ${ord(members)} to join\nCreated ${timeDelta(convertIDtoUnix(user.user.id))} ago`,
        color: 0x53dbac,
        author: {
          name: user.user.getTag(),
          iconUrl: user.user.getAvatarUrl()
        },
        footer: {
          text: `ID: ${user.user.id}`
        },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//MEMBER LEAVE LOGS
discord.on(discord.Event.GUILD_MEMBER_REMOVE, async (member, oldMember) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.joinLeaveLogChannelID))!;
  var joinDate = Date.parse(oldMember.joinedAt) 
  // Make embed
  if (logConfig.joinLeaveLogToggle.memberLeave == true) {
    await channel?.sendMessage(
      new discord.Embed({
        title: `Member left`,
        description: `${oldMember.toMention()} joined ${timeDelta(joinDate)} ago`,
        color: 0xfff6af,
        author: {
          name: oldMember.user.getTag(),
          iconUrl: oldMember.user.getAvatarUrl()
        },
        footer: {
          text: `ID: ${oldMember.user.id}`
        },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//MEMBER UPDATE LOGS
discord.on(discord.Event.GUILD_MEMBER_UPDATE, async (member, oldMember) => {
  if (member.user.id != '270148059269300224') {
    let channel = (await discord.getGuild().then((g) => g.getChannel(logConfig.logChannels.memberLogChannelID))) as MessageChannel;
    //Role(s) Changed
    if (member.roles.toString() != oldMember.roles.toString()) {
      var difference1 = oldMember.roles.filter((x) => member.roles.indexOf(x) === -1);
      var difference2 = member.roles.filter((x) => oldMember.roles.indexOf(x) === -1);
      var diffArray = difference1.concat(difference2);
      var diffstring = diffArray.toString();
      var output = (Math.abs(member.roles.length - oldMember.roles.length) == diffArray.length) ? `<@&${diffstring.replace(/,/g, '>, <@&')}>` : `**Added:** <@&${difference2.toString().replace(/,/g, '>, <@&')}>\n**Removed:** <@&${difference1.toString().replace(/,/g, '>, <@&')}>`;
      var title = output.includes('**') ? 'updated' : member.roles.length > oldMember.roles.length ? 'added' : 'removed';
      //Make log embed
      if (logConfig.memberLogToggle.memberRoleUpdates == true) {
        await channel?.sendMessage(
          new discord.Embed({
            title: `Roles ${title}`,
            description: output,
            color: 0x4286f4,
            author: {
              name: oldMember.user.getTag(),
              iconUrl: oldMember.user.getAvatarUrl()
            },
            footer: {
              text: `ID: ${oldMember.user.id}`
            },
            timestamp: new Date().toISOString()
          })
        );
      }
    } else {
      //Avatar Change
      if (member.user.avatar != oldMember.user.avatar) {
        if (logConfig.memberLogToggle.memberAvatarChange == true) {
          await channel?.sendMessage(
            new discord.Embed({
              title: 'Avatar update',
              description: member.toMention(),
              color: 0x4286f4,
              author: {
                name: oldMember.user.getTag(),
                iconUrl: oldMember.user.getAvatarUrl()
              },
              footer: {
                text: `ID: ${oldMember.user.id}`
              },
              thumbnail: { url: member.user.getAvatarUrl() },
              timestamp: new Date().toISOString()
            })
          );
        }
      } else {
        //nickname change
        if (member.nick != oldMember.nick) {
          var title = oldMember.nick == null ? 'added' : member.nick == null ? 'removed' : 'change';
          var before = oldMember.nick == null ? member.user.username : oldMember.nick;
          var after = member.nick == null ? member.user.username : member.nick;
          if (logConfig.memberLogToggle.memberNicknameChange == true) {
            await channel?.sendMessage(
              new discord.Embed({
                title: `Nickname ${title}`,
                description: `**Before:** ${before}\n**After:** ${after}`,
                color: 0x4286f4,
                author: {
                  name: oldMember.user.getTag(),
                  iconUrl: oldMember.user.getAvatarUrl()
                },
                footer: {
                  text: `ID: ${oldMember.user.id}`
                },
                timestamp: new Date().toISOString()
              })
            );
          }
        } else {
          //discriminator change
          if (member.user.discriminator != oldMember.user.discriminator) {
            if (logConfig.memberLogToggle.memberDiscriminatorChange == true) {
              await channel?.sendMessage(
                new discord.Embed({
                  title: 'Discriminator update',
                  description: `**Before:** ${oldMember.user.discriminator}\n**After:** ${member.user.discriminator}`,
                  color: 0x4286f4,
                  author: {
                    name: oldMember.user.getTag(),
                    iconUrl: oldMember.user.getAvatarUrl()
                  },
                  footer: {
                    text: `ID: ${oldMember.user.id}`
                  },
                  thumbnail: { url: member.user.getAvatarUrl() },
                  timestamp: new Date().toISOString()
                })
              );
            }
          } else {
            //username change
            if (member.user.username != oldMember.user.username) {
              var before = oldMember.user.username;
              var after = member.user.username;
              if (logConfig.memberLogToggle.memberUsernameChange == true) {
                await channel?.sendMessage(
                  new discord.Embed({
                    title: 'Name change',
                    description: `**Before:** ${before}\n**After:** ${after}`,
                    color: 0x4286f4,
                    author: {
                      name: oldMember.user.getTag(),
                      iconUrl: oldMember.user.getAvatarUrl()
                    },
                    footer: {
                      text: `ID: ${oldMember.user.id}`
                    },
                    timestamp: new Date().toISOString()
                  })
                );
              }
            }
          }
        }
      }
    }
  }
});

//MEMBER BAN LOGS (not modlogs)
discord.on(discord.Event.GUILD_BAN_ADD, async (guildBan) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.memberLogChannelID))!;
  if (logConfig.memberLogToggle.memberBans == true) {
    await channel?.sendMessage(
      new discord.Embed({
        title: 'Member banned',
        description: guildBan.user.toMention(),
        color: 0xdd5e53,
        author: {
          name: guildBan.user.getTag(),
          iconUrl: guildBan.user.getAvatarUrl()
        },
        footer: {
          text: `ID: ${guildBan.user.id}`
        },
        thumbnail: { url: guildBan.user.getAvatarUrl() },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//MEMBER UNBAN LOGS (not modlogs)
discord.on(discord.Event.GUILD_BAN_REMOVE, async (guildBan) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.memberLogChannelID))!;
  if (logConfig.memberLogToggle.memberUnbans == true) {
    await channel?.sendMessage(
      new discord.Embed({
        title: 'Member Unbanned',
        description: guildBan.user.toMention(),
        color: 0x56ddff,
        author: {
          name: guildBan.user.getTag(),
          iconUrl: guildBan.user.getAvatarUrl()
        },
        footer: {
          text: `ID: ${guildBan.user.id}`
        },
        thumbnail: { url: guildBan.user.getAvatarUrl() },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//MESSAGE DELETE LOGS
discord.on(discord.Event.MESSAGE_DELETE, async (event, message) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.messageLogChannelID))!;
  let delChannel = (await discord.getGuild().then((g) => g.getChannel(message?.channelId!))) as MessageChannel;
  if (logConfig.messageLogToggle.messageDelete == true && ((logConfig.messageLogIgnore.includes(message?.author.id!) || logConfig.messageLogIgnore.includes(message?.channelId!)) == false)) {
    await channel?.sendMessage(
      new discord.Embed({
        title: `Message deleted in #${delChannel?.name}`,
        description: message?.content,
        color: 0xdd5e53,
        author: {
          name: message?.author.getTag(),
          iconUrl: message?.author.getAvatarUrl()
        },
        footer: {
          text: `ID: ${message?.author.id}`
        },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//MESSAGE EDIT
discord.on(discord.Event.MESSAGE_UPDATE, async (newMessage, oldMessage) => {
  let channel = (await discord.getGuildTextChannel(logConfig.logChannels.messageLogChannelID))!;
  let delChannel = (await discord.getGuild().then((g) => g.getChannel(oldMessage?.channelId!))) as MessageChannel;
    if (logConfig.messageLogToggle.messageDelete == true && ((logConfig.messageLogIgnore.includes(oldMessage?.author.id!) || logConfig.messageLogIgnore.includes(oldMessage?.channelId!)) == false) ) {
    await channel?.sendMessage(
      new discord.Embed({
        title: `Message edited in #${delChannel?.name}`,
        description: `**Before:** ${oldMessage?.content}\n**After:** ${newMessage?.content}`,
        color: 0x4286f4,
        author: {
          name: oldMessage?.author.getTag(),
          iconUrl: oldMessage?.author.getAvatarUrl()
        },
        footer: {
          text: `ID: ${oldMessage?.author.id}`
        },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//ROLE CREATE LOGS
discord.on(discord.Event.GUILD_ROLE_CREATE, async (event) => {
  const guild = await discord.getGuild();
  let logChannel = (await guild.getChannel( logConfig.logChannels.serverLogChannelID )) as MessageChannel;
  const newRole = event.role;
  if (logConfig.serverLogToggle.roleCreate == true) {
    await logChannel?.sendMessage(
      new discord.Embed({
        title: 'New role created',
        description: `**Name:** ${newRole.name}\n**Color:** ${decimalToHex( newRole.color, 6 )}\n**Mentionable:** ${newRole.mentionable.toString()}\n**Displayed separately:** ${newRole.hoist.toString()}`,
        color: 0x53ddad,
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//ROLE UPDATE LOGS
discord.on(discord.Event.GUILD_ROLE_UPDATE, async (event, old) => {
  const messages = [];
  let logChannel = (await discord.getGuildTextChannel(logConfig.logChannels.serverLogChannelID))!;
  const timestamp = new Date().toISOString();
  const newRole = event.role;
  if (logConfig.serverLogToggle.roleUpdate == true) {
    if (event.role.color !== old.color) {
      messages.push({
        title: `Role ${event.role.name} updated`,
        fields: [
          {
            inline: true,
            name: 'Before',
            value: `**Color:** #${decimalToHex(old.color, 6)}`
          },
          {
            inline: true,
            name: 'After',
            value: `**Color:** #${decimalToHex(event.role.color, 6)}`
          }
        ],
        color: 4359924,
        type: 'rich',
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    if (event.role.hoist !== old.hoist) {
      messages.push({
        title: `Role ${event.role.name} updated`,
        fields: [
          {
            inline: true,
            name: 'Before',
            value: `**Hoisted:** ${old.hoist.toString()}`
          },
          {
            inline: true,
            name: 'After',
            value: `**Hoisted:** ${event.role.hoist.toString()}`
          }
        ],
        color: 4359924,
        type: 'rich',
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    if (event.role.name !== old.name) {
      messages.push({
        title: `Role ${event.role.name} updated`,
        fields: [
          {
            inline: true,
            name: 'Before',
            value: `**Name:** ${old.name}`
          },
          {
            inline: true,
            name: 'After',
            value: `**Name:** ${event.role.name}`
          }
        ],
        color: 4359924,
        type: 'rich',
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    if (event.role.mentionable !== old.mentionable) {
      messages.push({
        title: `Role ${event.role.name} updated`,
        fields: [
          {
            inline: true,
            name: 'Before',
            value: `**Mentionable:** ${old.mentionable.toString()}`
          },
          {
            inline: true,
            name: 'After',
            value: `**Mentionable:** ${event.role.mentionable.toString()}`
          }
        ],
        color: 4359924,
        type: 'rich',
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    if (event.role.position !== old.position) {
      messages.push({
        title: `Role ${event.role.name} updated`,
        fields: [
          {
            inline: true,
            name: 'Before',
            value: `**Position:** ${old.position.toString()}`
          },
          {
            inline: true,
            name: 'After',
            value: `**Position:** ${event.role.position.toString()}`
          }
        ],
        color: 4359924,
        type: 'rich',
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    if (event.role.permissions !== old.permissions) {
      const diff = makePermissionDiff(event.role.permissions, old.permissions);
      const diffBlock = `\`\`\`diff\n${diff.added.length ? diff.added.join('\n') : ''}${diff.removed.length ? '\n' + diff.removed.join('\n') : ''}󠁡\n\`\`\``;
      messages.push({
        color: 4359924,
        type: 'rich',
        title: `Role ${event.role.name} updated`,
        fields: [{ inline: true, name: 'New permissions', value: diffBlock }],
        footer: { text: `Role ID: ${event.role.id}` },
        timestamp: timestamp
      });
    }
    //Send messages
    messages.forEach(async (message) => {
      await logChannel?.sendMessage(new discord.Embed(message))
    })
  }
});

//ROLE DELETE LOGS
discord.on(discord.Event.GUILD_ROLE_DELETE, async (event, oldRole) => {
  let logChannel = (await discord.getGuildTextChannel(logConfig.logChannels.serverLogChannelID))!;
  const guild = await discord.getGuild();
  for await (const event of guild.iterAuditLogs({ limit: 1 })) {
    if (logConfig.serverLogToggle.roleDelete == true) {
      if (event.actionType == 32) {
        var perms = removeArrayOverlap(bitfieldToArray(event.changes.permissions.oldValue), bitfieldToArray(oldRole?.permissions!)).toString();
        await logChannel?.sendMessage(
          new discord.Embed({
            title: `Role "${event.changes.name.oldValue}" deleted`,
            description: `**Name:** ${event.changes.name.oldValue}\n**Color:** #${decimalToHex(event.changes.color.oldValue, 6)}\n**Mentionable:** ${capitalizeFirstLetter(event.changes.mentionable.oldValue.toString())}\n**Displayed separately:** ${capitalizeFirstLetter(event.changes.hoist.oldValue.toString())}\n**Specific perms:** ${perms == '' ? 'N/A' : perms.replace(',', ', ')}`,
            color: 0xdd5e53,
            footer: { text: `Role ID: ${event.targetId}` },
            timestamp: new Date().toISOString()
          })
        );
      }
    }
  }
});

//CHANNEL CREATE LOGS
discord.on(discord.Event.CHANNEL_CREATE, async (anyChannel) => {
  let logChannel = (await discord.getGuildTextChannel(logConfig.logChannels.serverLogChannelID))!;
  const guild = await discord.getGuild();
  var newChannel = await guild.getChannel(anyChannel.id);
  var channelCategory = await discord.getGuildCategory(newChannel?.parentId!);
  var channelPerms = newChannel?.permissionOverwrites;
  let arr = [];
  for (var counter = 0; counter < channelPerms!.length; counter++) {
    var role = await guild.getRole(channelPerms![counter].id);
    var permMember = await guild.getMember(channelPerms![counter].id);
    var emoji = channelPerms![counter].deny === 1024 ? '❌' : '✅';
    arr.push({
      inline: false,
      name: role != null ? 'Role override for '.concat(role.name) : 'User override for '.concat(permMember!.user.getTag()),
      value: `**Read messages:** ${emoji}`
    });
  }
  if (logConfig.serverLogToggle.channelCreate == true) {
    await logChannel?.sendMessage(
      new discord.Embed({
        title: 'Text channel created',
        description: `**Name:** ${newChannel?.name}\n**Category:** ${channelCategory?.name}`,
        color: 0x53ddad,
        fields: arr,
        footer: { text: `Channel ID: ${newChannel?.id}` },
        timestamp: new Date().toISOString()
      })
    );
  }
});

//CHANNEL UPDATE LOGS
discord.on(discord.Event.CHANNEL_UPDATE, async (channel, oldChannel) => {
  let logChannel = (await discord.getGuildTextChannel( logConfig.logChannels.serverLogChannelID ))!;
  const guild = await discord.getGuild();
  for await (const event of guild.iterAuditLogs({ limit: 1 })) {
    const eventString = JSON.stringify(event.changes);
    if (logConfig.serverLogToggle.channelUpdate == true) {
      var before = '';
      var after = '';
      if (event.actionType == 11) {
        if (eventString.includes('name')) {
          before += `**Name:** ${event.changes.name!.oldValue}\n`;
          after += `**Name:** ${event.changes.name!.newValue}\n`;
        }
        if (eventString.includes('nsfw')) {
          before += `**NSFW:** ${capitalizeFirstLetter(event.changes.nsfw!.oldValue!.toString())}\n`;
          after += `**NSFW:** ${capitalizeFirstLetter(event.changes.nsfw!.newValue.toString())}'\n`;
        }
        if (eventString.includes('topic')) {
          before += `**Topic:** ${event.changes.topic?.oldValue == undefined ? 'none' : event.changes.topic.oldValue}\n`;
          after += `**Topic:** ${event.changes.topic?.newValue == undefined ? 'none' : event.changes.topic.newValue}\n`;
        }
        await logChannel?.sendMessage(
          new discord.Embed({
            title: 'Text channel updated',
            fields: [
              {
                inline: true,
                name: 'Before',
                value: before
              },
              {
                inline: true,
                name: 'After',
                value: after
              }
            ],
            color: 0x4286f4,
            footer: { text: `Channel ID: ${event.targetId}` },
            timestamp: new Date().toISOString()
          })
        );
      }
    }
  }
});

//CHANNEL DELETE LOGS
discord.on(discord.Event.CHANNEL_DELETE, async (channel) => {
  let logChannel = (await discord.getGuildTextChannel(logConfig.logChannels.serverLogChannelID))!;
  var guild = await discord.getGuild();
  for await (const event of guild.iterAuditLogs({ limit: 1 })) {
    if (logConfig.serverLogToggle.channelDelete == true) {
      if (event.actionType == 12) {
        await logChannel?.sendMessage(
          new discord.Embed({
            title: 'Text channel deleted',
            description: `**Name:** ${event.changes.name.oldValue}`,
            color: 0xdd5e53,
            footer: { text: `Channel ID: ${event.targetId}` },
            timestamp: new Date().toISOString()
          })
        );
      }
    }
  }
});
