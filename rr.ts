/*
{
    "msgID": {
        "emoji id or unicode": ReactionRoleConfig
    }
}
*/
const config: Config = {};

/*
NORMAL: add role on reaction add, remove role on reaction remove
VERIFY: add role and remove reaction on reaction add. Do not allow role removal.
REVERSE: remove role on reaction add, add role on reaction remove
REVERSE_VERIFY: remove role and reaction on reaction remove. Do not allow role addition.
 */
interface ReactionRoleConfig {
	role: string;
	mode: 'NORMAL' | 'VERIFY' | 'REVERSE' | 'REVERSE_VERIFY';
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

	if (['NORMAL', 'VERIFY'].includes(config.mode))
		await reaction.member!.addRole(config.role);
	if (['REVERSE', 'REVERSE_VERIFY'].includes(config.mode))
		await reaction.member!.removeRole(config.role);
	const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
	const message = (await channel.getMessage(reaction.messageId))!;
	if (['VERIFY', 'REVERSE_VERIFY'].includes(config.mode))
		message.deleteReaction(
			emojiIdentifier,
			reaction.member!.user.id.toString(),
		);
});

discord.on(discord.Event.MESSAGE_REACTION_REMOVE, async reaction => {
	let emojiIdentifier = reaction.emoji.id || reaction.emoji.name!;

	let config = getReactionConfig(reaction);
	if (!config) return;

	if (['REVERSE'].includes(config.mode))
		await reaction.member!.addRole(config.role);
	if (['NORMAL'].includes(config.mode))
		await reaction.member!.removeRole(config.role);

	const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
	const message = (await channel.getMessage(reaction.messageId))!;
});
