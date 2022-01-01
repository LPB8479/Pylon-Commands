import { config } from '../config/config';
import { amConfig } from '../config/amconfig';
import { modlogCount } from '../functions/modlogCount';
function roleCheck(member: discord.GuildMember) {
    var checkArray: boolean[] = [];
    member.roles.forEach((role) => {
        checkArray.push(amConfig.config.whitelistedroles.includes(role))
    })
    return checkArray;
}

//Not completed: tempmute, tempban
async function warn(member: discord.GuildMember, reason: string, moderator: discord.User, message: discord.Message) {
    await message.reply(`**${member.user.getTag()}** has been warned.\n**Reason:** ${reason.split(' (')[0]}`);
    const channel = await discord.getGuildTextChannel(config.channel.modlog);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`Warn | Case ${uses}`);
    embed.setColor(0xfcf77a);
    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}\n**Responsible moderator:**${moderator.getTag()}`);
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
}
async function tempmute(member: discord.GuildMember, duration: number | boolean, reason: string, moderator: discord.User) { }
async function mute(member: discord.GuildMember, reason: string, moderator: discord.User) {
    await member.addRole(amConfig.config.muterole);
    var channel = await discord.getGuildTextChannel(amConfig.config.modlogchannel);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`Mute | Case ${uses}`);
    embed.setColor(0xf48942);
    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}.\n**Responsible moderator:** ${moderator.getTag()}`);
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
}
async function kick(member: discord.GuildMember, reason: string, moderator: discord.User) {
    await member.kick();
    var channel = await discord.getGuildTextChannel(amConfig.config.modlogchannel);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`kick | Case ${uses}`);
    embed.setColor(0x4c88ff);
    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}.\n**Responsible moderator:** ${moderator.getTag()}`);
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
}
async function tempban(member: discord.GuildMember, duration: number | boolean, reason: string, moderator: discord.User) { }
async function ban(member: discord.GuildMember, reason: string, moderator: discord.User) {
    await member.ban({ reason: reason });
    var channel = await discord.getGuildTextChannel(amConfig.config.modlogchannel);
    let uses = await modlogCount('count');
    // Assemble embed
    var embed = new discord.Embed();
    embed.setTitle(`ban | Case ${uses}`);
    embed.setColor(0xdd5e53);
    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** ${reason}. \n**Responsible moderator:** ${moderator.getTag()}`);
    embed.setFooter({ text: `ID: ${member.user.id}` });
    embed.setTimestamp(new Date().toISOString());
    await channel?.sendMessage(embed);
}
async function defer(message: discord.Message, focus: string) {
    var dramaChannel = await discord.getGuildTextChannel(amConfig.config.dramachannel);
    var dramaEmbed = new discord.Embed();
    dramaEmbed.setColor(0xfeed67);
    dramaEmbed.setDescription(`Potential trouble found in ${(await discord.getGuildTextChannel(message.channelId))?.toMention()}`);
    dramaEmbed.addField({
        name: message.author.getTag(),
        value: focus != '' ? message.content.replace(focus, `**${focus}**`) : message.content,
        inline: false
    });
    let dramaMsg = await dramaChannel?.sendMessage(dramaEmbed)!;
    await dramaMsg?.addReaction(discord.decor.Emojis.HAMMER);
    await dramaMsg?.addReaction(discord.decor.Emojis.MUTE);
    await dramaMsg?.addReaction(discord.decor.Emojis.BOOT);
    await dramaMsg?.addReaction(discord.decor.Emojis.WASTEBASKET);
    //await dramaMsg.addReaction('twelve:922320005603930213')
    //await dramaMsg.addReaction('twentyfour:922320006019166268')
    //await dramaMsg.addReaction('fourtyeight:922320006115647509')
    await dramaMsg?.addReaction(discord.decor.Emojis.X);
    await dramaMsg?.addReaction(discord.decor.Emojis.LOUD_SOUND);
    await amConfig.kv.drama.put(dramaMsg?.id, message.channelId + '/' + message.id + '/');
    await amConfig.kv.drama.put(dramaMsg?.id, `${message.channelId}/${message.id}/${message.author.id}`)
}
async function sendMessage(message: discord.Message, text: string) {
    var channelObj = await message.getChannel();
    var nick = (message.member.nick != null) ? message.member.nick : message.member.user.username
    var parsedMessage = text.replace(`^user`, nick);
    await channelObj.sendMessage(`${parsedMessage}`);
}

discord.on('MESSAGE_CREATE', async (message) => {
    if (amConfig.config.whitelistedchannels.includes(message.channelId) == false && roleCheck(message.member!).includes(true) == false) {
        //Bad words
        for (var badwordcount = 0; badwordcount < amConfig.badwords.wordlist.length; badwordcount++) {
            if (message.content.toLowerCase().includes(amConfig.badwords.wordlist[badwordcount])) {
                if (amConfig.badwords.punish.warn == true) {
                    warn(message.member!, `Automatic action for using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser(), message);
                }
                if (amConfig.badwords.punish.tempmute[0] == true) {
                    tempmute(message.member!, amConfig.badwords.punish.tempmute[1], `using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser());
                }
                if (amConfig.badwords.punish.mute == true) {
                    mute(message.member!, `Automatic action for using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser());
                }
                if (amConfig.badwords.punish.kick == true) {
                    kick(message.member!, `Automatic action for using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser());
                }
                if (amConfig.badwords.punish.tempban[0] == true) {
                    tempban(message.member!, amConfig.badwords.punish.tempban[1], `Automatic action for using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser());
                }
                if (amConfig.badwords.punish.ban == true) {
                    ban(message.member!, `Automatic action for using a blacklisted word (${amConfig.badwords.wordlist[badwordcount]})`, await discord.getBotUser());
                }
                if (amConfig.badwords.punish.defer == true) {
                    defer(message, amConfig.badwords.wordlist[badwordcount]);
                }
                if (amConfig.badwords.punish.message[0] == true) {
                    sendMessage(message, amConfig.badwords.punish.message[1].toString())
                }
                if (amConfig.badwords.punish.deleteMessage == true) {
                    message.delete();
                }
                break;
            }
        }

        //Bad links
        if (amConfig.badlinks.mode == 'blacklist') {
            for (var badlinkcount = 0; badlinkcount < amConfig.badlinks.domains.length; badlinkcount++) {
                if (message.content.toLowerCase().includes(amConfig.badlinks.domains[badlinkcount])) {
                    if (amConfig.badlinks.punish.warn == true) {
                        warn(message.member!, `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser(), message);
                    }
                    if (amConfig.badlinks.punish.tempmute[0] == true) {
                        tempmute(message.member!, amConfig.badlinks.punish.tempmute[1], `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser());
                    }
                    if (amConfig.badlinks.punish.mute == true) {
                        mute(message.member!, `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser());
                    }
                    if (amConfig.badlinks.punish.kick == true) {
                        kick(message.member!, `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser());
                    }
                    if (amConfig.badlinks.punish.tempban[0] == true) {
                        tempban(message.member!, amConfig.badlinks.punish.tempban[1], `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser());
                    }
                    if (amConfig.badlinks.punish.ban == true) {
                        ban(message.member!, `Automatic action for posting links (${amConfig.badlinks.domains[badlinkcount]})`, await discord.getBotUser());
                    }
                    if (amConfig.badlinks.punish.defer == true) {
                        defer(message, amConfig.badlinks.domains[badlinkcount]);
                    }
                    if (amConfig.badlinks.punish.message[0] == true) {
                        sendMessage(message, amConfig.badlinks.punish.message[1].toString())
                    }
                    if (amConfig.badlinks.punish.deleteMessage == true) {
                        message.delete();
                    }
                    break;
                }
            }
        } else if (amConfig.badlinks.mode == 'whitelist') {
            var regexMatch = message.content.toLowerCase().match(/(((https?:\/\/)|(www\.))[^\s]+)/g);
            var regexMatchSani: string[] = [];
            regexMatch?.forEach((match) => {
                regexMatchSani.push(match.replace(/(https?:\/\/)|(www\.)/g, '').match(/[\w.-]+/g)[0])
            })
            var linkcheck: boolean[] = []; //t/f array
            var badlinks: string[] = []; //link array
            regexMatchSani.forEach((match) => {
                amConfig.badlinks.domains.forEach((link) => {
                    if (match.includes(link)) {
                        linkcheck.push(false)
                    } else {
                        linkcheck.push(true)
                        badlinks.push(match)
                    }
                })
            })
            if (linkcheck.includes(true)) {
                if (amConfig.badlinks.punish.warn == true) {
                    warn(message.member!, `Automatic action for posting links (${regexMatchSani})`, await discord.getBotUser(), message);
                }
                if (amConfig.badlinks.punish.tempmute[0] == true) {
                    tempmute(message.member!, amConfig.badlinks.punish.tempmute[1], `Automatic action for posting links (${badlinks.toString()})`, await discord.getBotUser());
                }
                if (amConfig.badlinks.punish.mute == true) {
                    mute(message.member!, `Automatic action for posting links (${badlinks.toString()})`, await discord.getBotUser());
                }
                if (amConfig.badlinks.punish.kick == true) {
                    kick(message.member!, `Automatic action for posting links (${badlinks.toString()})`, await discord.getBotUser());
                }
                if (amConfig.badlinks.punish.tempban[0] == true) {
                    tempban(message.member!, amConfig.badlinks.punish.tempban[1], `Automatic action for posting links (${badlinks.toString()})`, await discord.getBotUser());
                }
                if (amConfig.badlinks.punish.ban == true) {
                    ban(message.member!, `Automatic action for posting links (${badlinks.toString()})`, await discord.getBotUser());
                }
                if (amConfig.badlinks.punish.defer == true) {
                    defer(message, badlinks.toString());
                }
                if (amConfig.badlinks.punish.message[0] == true) {
                    sendMessage(message, amConfig.badlinks.punish.message[1].toString())
                }
                if (amConfig.badlinks.punish.deleteMessage == true) {
                    message.delete();
                }
            }
        }

        //Caps Spam
        var capsCount = message.content.replace(/[^A-Z]/g, '').length;
        var stringCount = message.content.replace(/\s/g, '').length;
        var capsPercentage = (capsCount / stringCount) * 100;
        if (capsPercentage >= amConfig.capsspam.limit && stringCount > 5) {
            if (amConfig.capsspam.punish.warn == true) {
                warn(message.member!, `Automatic action for excessive caps lock`, await discord.getBotUser(), message);
            }
            if (amConfig.capsspam.punish.tempmute[0] == true) {
                tempmute(message.member!, amConfig.capsspam.punish.tempmute[1], `Automatic action for excessive caps lock`, await discord.getBotUser());
            }
            if (amConfig.capsspam.punish.mute == true) {
                mute(message.member!, `Automatic action for excessive caps lock`, await discord.getBotUser());
            }
            if (amConfig.capsspam.punish.kick == true) {
                kick(message.member!, `Automatic action for excessive caps lock`, await discord.getBotUser());
            }
            if (amConfig.capsspam.punish.tempban[0] == true) {
                tempban(message.member!, amConfig.capsspam.punish.tempban[1], `Automatic action for excessive caps lock`, await discord.getBotUser());
            }
            if (amConfig.capsspam.punish.ban == true) {
                ban(message.member!, `Automatic action for excessive caps lock`, await discord.getBotUser());
            }
            if (amConfig.capsspam.punish.defer == true) {
                defer(message, '');
            }
            if (amConfig.capsspam.punish.message[0] == true) {
                sendMessage(message, amConfig.capsspam.punish.message[1].toString())
            }
            if (amConfig.capsspam.punish.deleteMessage == true) {
                message.delete();
            }
        }

        //Scary Files
        if (amConfig.scaryfiles.delete == true && message.attachments != []) {
            var fileCheck = [];
            message.attachments.forEach((file) => {
                var fileParse = file.filename.split('.');
                var fileExt = fileParse.reverse()[0];
                fileCheck.push((amConfig.scaryfiles.validExtensions.includes(fileExt) == false) ? true : false)
            })
            if (fileCheck.includes(true)) { message.delete() }
        }

        //Bad invites
        var inviteCheck = [];
        var msgArray = message.content.split(' ');
        if (message.content.includes('discordapp.com/invite/')) {
            inviteCheck.push(true);
            var inviteLoc = msgArray.findIndex((element) => element.includes('invite'));
            var inviteCode = msgArray[inviteLoc].split('invite/')[1];
        } else if (message.content.includes('discord.gg/')) {
            inviteCheck.push(true);
            var inviteLoc = msgArray.findIndex((element) => element.includes('discord.gg'));
            var inviteCode = msgArray[inviteLoc].split('gg/')[1];
        } else if (message.content.includes('discord.com/invite/')) {
            inviteCheck.push(true);
            var inviteLoc = msgArray.findIndex((element) => element.includes('invite'));
            var inviteCode = msgArray[inviteLoc].split('invite/')[1];
        }
        if (amConfig.badinvites.mode == 'blacklist' && inviteCheck.includes(true)) {
            var inviteObj = await discord.getInvite(inviteCode!);
            if (amConfig.badinvites.serverIDs.includes(inviteObj!.guild!.id)) {
                if (amConfig.badinvites.punish.warn == true) {
                    warn(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser(), message);
                }
                if (amConfig.badinvites.punish.tempmute[0] == true) {
                    tempmute(message.member!, amConfig.badinvites.punish.tempmute[1], `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.mute == true) {
                    mute(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.kick == true) {
                    kick(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.tempban[0] == true) {
                    tempban(message.member!, amConfig.badinvites.punish.tempban[1], `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.ban == true) {
                    ban(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.defer == true) {
                    defer(message, msgArray[inviteLoc!]);
                }
                if (amConfig.badinvites.punish.message[0] == true) {
                    sendMessage(message, amConfig.badinvites.punish.message[1].toString())
                }
                if (amConfig.badinvites.punish.deleteMessage == true) {
                    message.delete();
                }
            }
        } else if (amConfig.badinvites.mode == 'whitelist' && inviteCheck.includes(true)) {
            var inviteObj = await discord.getInvite(inviteCode!);
            if (amConfig.badinvites.serverIDs.includes(inviteObj!.guild!.id) == false) {
                if (amConfig.badinvites.punish.warn == true) {
                    warn(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser(), message);
                }
                if (amConfig.badinvites.punish.tempmute[0] == true) {
                    tempmute(message.member!, amConfig.badinvites.punish.tempmute[1], `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.mute == true) {
                    mute(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.kick == true) {
                    kick(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.tempban[0] == true) {
                    tempban(message.member!, amConfig.badinvites.punish.tempban[1], `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.ban == true) {
                    ban(message.member!, `Automatic action for posting invites (${msgArray[inviteLoc!]})`, await discord.getBotUser());
                }
                if (amConfig.badinvites.punish.defer == true) {
                    defer(message, msgArray[inviteLoc!]);
                }
                if (amConfig.badinvites.punish.message[0] == true) {
                    sendMessage(message, amConfig.badinvites.punish.message[1].toString())
                }
                if (amConfig.badinvites.punish.deleteMessage == true) {
                    message.delete();
                }
            }
        }
    }
});

//Drama channel actions
discord.on(discord.Event.MESSAGE_REACTION_ADD, async (reaction) => {
    if (reaction.channelId == amConfig.config.dramachannel) {
        var dramaContent = await amConfig.kv.drama.get<string>(reaction.messageId);
        var dramaArray = dramaContent?.split('/');
        var message = await (await discord.getGuildTextChannel(dramaArray![0]))?.getMessage(dramaArray![1]);
        var member = await (await discord.getGuild())?.getMember(dramaArray![2]);
        if (member != null) {
            switch (reaction.emoji.name) {
                case discord.decor.Emojis.HAMMER /*Ban*/:
                    ban(member, 'Drama alert action', reaction.member!.user);
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case discord.decor.Emojis.MUTE /*Mute*/:
                    mute(member, 'Drama alert action', reaction.member!.user);
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case discord.decor.Emojis.BOOT /*Kick*/:
                    await amConfig.kv.drama.delete(reaction.messageId);
                    kick(member, 'Drama alert action', reaction.member!.user);
                    break;
                case discord.decor.Emojis.WASTEBASKET /*Delete message*/:
                    await message?.delete();
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case 'twelve' /*Tempmute 12h*/:
                    tempmute(member, 720, 'Drama alert action', reaction.member!.user);
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case 'twentyfour' /*Tempmute 24h*/:
                    tempmute(member, 1440, 'Drama alert action', reaction.member!.user);
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case 'fourtyeight' /*Tempmute 48h*/:
                    tempmute(member, 2880, 'Drama alert action', reaction.member!.user);
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case discord.decor.Emojis.X /*Delete drama message*/:
                    var dramaMsg = await (await discord.getGuildTextChannel(reaction.channelId))?.getMessage(reaction.messageId)
                    dramaMsg?.delete()
                    await amConfig.kv.drama.delete(reaction.messageId);
                    break;
                case discord.decor.Emojis.LOUD_SOUND /*Unmute*/:
                    try {
                        await config.kv.tempmute.delete(member.user.id);
                    } catch {
                        console.log('Previous mute was permanent (ignore this error)');
                    }
                    await member.removeRole(amConfig.config.muterole);
                    const channel = await discord.getGuildTextChannel(amConfig.config.modlogchannel);
                    let uses = await modlogCount('count');
                    // Assemble embed
                    var embed = new discord.Embed();
                    embed.setTitle('Unmute | Case ' + uses);
                    embed.setColor(0x47f0a6);
                    embed.setDescription(`**Offender:** ${member.user.getTag()} ${member.user.toMention()}\n**Reason:** Drama alert action\n**Responsible moderator:**${reaction.member!.user.getTag()}`);
                    embed.setFooter({ text: `ID: ${member.user.id}` });
                    embed.setTimestamp(new Date().toISOString());
                    await channel?.sendMessage(embed);
                    break;
            }
        }
    }
});