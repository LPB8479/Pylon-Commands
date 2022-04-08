import { config } from '../config/config';
import { rrconfig, ReactionRoleConfig } from '../config/rrconfig';

function getReactionConfig(
    event:
        | discord.Event.IMessageReactionAdd
        | discord.Event.IMessageReactionRemove
): ReactionRoleConfig | null {
    let msgConfig = rrconfig.rr[event.messageId];
    if (!msgConfig) return null;
    let reactionConfig = msgConfig[event.emoji.id || event.emoji.name!];
    if (!reactionConfig) return null;

    return reactionConfig;
}

discord.on(discord.Event.MESSAGE_REACTION_ADD, async (reaction) => {
    let emojiIdentifier = reaction.emoji.id || reaction.emoji.name!;

    let config = getReactionConfig(reaction);
    if (!config) return;

    if (
        ['NORMAL', 'VERIFY'].includes(config.mode) ||
        (['TOGGLE'].includes(config.mode) &&
            !reaction.member!.roles.includes(config.role))
    ) {
        await reaction.member!.addRole(config.role);
    }
    if (
        ['REVERSE', 'REVERSE_VERIFY'].includes(config.mode) ||
        (['TOGGLE'].includes(config.mode) &&
            reaction.member!.roles.includes(config.role))
    ) {
        await reaction.member!.removeRole(config.role);
    }
    const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
    const message = (await channel.getMessage(reaction.messageId))!;
    if (['VERIFY', 'REVERSE_VERIFY'].includes(config.mode)) {
        message.deleteReaction(
            emojiIdentifier,
            reaction.member!.user.id.toString()
        );
    }
});

discord.on(discord.Event.MESSAGE_REACTION_REMOVE, async (reaction) => {
    let emojiIdentifier = reaction.emoji.id || reaction.emoji.name!;

    let config = getReactionConfig(reaction);
    if (!config) return;

    if (['REVERSE'].includes(config.mode)) {
        await reaction.member!.addRole(config.role);
    }
    if (['NORMAL'].includes(config.mode)) {
        await reaction.member!.removeRole(config.role);
    }

    const channel = (await discord.getGuildTextChannel(reaction.channelId))!;
    const message = (await channel.getMessage(reaction.messageId))!;
});
