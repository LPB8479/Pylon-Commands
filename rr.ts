/*
{
    "msgID": {
        "emoji id or unicode": ReactionRoleConfig
    }
}
*/
const config: Config = {};

interface ReactionRoleConfig {
	role: string;
	mode: 'NORMAL' | 'VERIFY';
}

interface Config {
	[key: string]: {
		[key: string]: ReactionRoleConfig;
	};
}

function getReactionConfig(
	event:
		| discord.Event.IMessageReactionAdd
		| discord.Event.IMessageReactionRemove,
): ReactionRoleConfig | null {
	let msgConfig = config[event.messageId];
	if (!msgConfig) return null;
	let reactionConfig = msgConfig[event.emoji.id || event.emoji.name!];
	if (!reactionConfig) return null;

	return reactionConfig;
}

discord.on(discord.Event.MESSAGE_REACTION_ADD, async reaction => {
	let emojiIdentifier = reaction.emoji.id || reaction.emoji.name!;

	let config = getReactionConfig(reaction);
	if (!config) return;

	await reaction.member!.addRole(config.role);
	const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
	const message = (await channel.getMessage(reaction.messageId))!;
	if (['VERIFY'].includes(config.mode))
		message.deleteReaction(
			emojiIdentifier,
			reaction.member!.user.id.toString(),
		);
});

discord.on(discord.Event.MESSAGE_REACTION_REMOVE, async reaction => {
	let emojiIdentifier = reaction.emoji.id || reaction.emoji.name!;

	let config = getReactionConfig(reaction);
	if (!config) return;

	if (['VERIFY'].includes(config.mode)) return;

	await reaction.member!.removeRole(config.role);
	const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
	const message = (await channel.getMessage(reaction.messageId))!;
});
