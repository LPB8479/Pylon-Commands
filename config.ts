export const config: config = {
	slashCommands: discord.interactions.commands,
	commands: new discord.command.CommandGroup({
		defaultPrefix: '&',
		additionalPrefixes: ['!'],
		mentionPrefix: true,
	}),
	channel: {
		welcome: '000000000000000000',
		modlog: '000000000000000000',
	},
	kv: {
		modlog: new pylon.KVNamespace('modlog'),
	},
	rr: {},
};

export interface config {
	slashCommands: typeof discord.interactions.commands;
	commands: discord.command.CommandGroup;
	channel: {
		welcome: string;
		modlog: string;
	};
	kv: {
		modlog: pylon.KVNamespace;
	};
	rr: {
		[key: string]: {
			[key: string]: ReactionRoleConfig;
		};
	};
}

export interface ReactionRoleConfig {
	role: string;
	/*
NORMAL: add role on reaction add, remove role on reaction remove
VERIFY: add role and remove reaction on reaction add. Do not allow role removal.
REVERSE: remove role on reaction add, add role on reaction remove
REVERSE_VERIFY: remove role and reaction on reaction remove. Do not allow role addition.
TOGGLE: toggle role and remove reaction on reaction add.
 */
	mode: 'NORMAL' | 'VERIFY' | 'REVERSE' | 'REVERSE_VERIFY' | 'TOGGLE';
}
