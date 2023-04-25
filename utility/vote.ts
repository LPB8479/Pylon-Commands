import { config } from '../config/config';
const entrantRole = ''
config.slashCommands.register(
    {
        name: 'vote',
        description: 'Submit your vote for the challenge',
        options: (opt) => ({
            vote1: opt.guildMember('First place vote'),
            vote2: opt.guildMember('Second place vote')
        })
    },
    async (interaction, { vote1, vote2 }) => {
        if (interaction.member.roles.includes(entrantRole)) {
            var voteKv = new pylon.KVNamespace('votes');
            var alreadyVoted = await voteKv.list()
            if (alreadyVoted.includes(interaction.member.user.id)) {
                await interaction.respondEphemeral(`You have already voted.`)
            } else if (vote1 != vote2 && vote1 != interaction.member && vote2 != interaction.member) {
                var guild = await discord.getGuild()
                var memb1 = (await guild.getMember(vote1.user.id)).roles
                var memb2 = (await guild.getMember(vote2.user.id)).roles
                if (memb1.includes(entrantRole) && memb2.includes(entrantRole)) {
                    await voteKv.put(interaction.member.user.id, `1:${vote1.user.id}\n2:${vote2.user.id}`);
                    await interaction.respondEphemeral(`Success! Your response has been recorded:\n\`First place: ${vote1.user.getTag()}\nSecond place: ${vote2.user.getTag()}\`\nIf this is incorrect, please privately contact <@!373100160756088842>.`)
                    /*Send mods a message when all votes have been submitted*/
                    var members = [];
                    for await (const member of guild.iterMembers()) {
                        if (member.roles.includes(entrantRole)) {
                            members.push(member.user.id);
                        }
                    }
                    if (alreadyVoted.length = members.length) {
                        var modPg = await discord.getGuildTextChannel(config.channel.modpg)
                        modPg.sendMessage(`<@&${config.role.modRole}> all votes have been submitted`)
                    }
                } else {
                    await interaction.respondEphemeral(`Please resubmit your vote. You cannot vote for people who have not entered the contest.`)
                }
            } else {
                await interaction.respondEphemeral(`Please resubmit your vote. You may not vote for yourself and you may not vote for the same entrant multiple times.`)
            }
        } else {
            await interaction.respondEphemeral(`You are not eligable to vote. Voting is only open to challenge participants.`)
        }
    })