export const rrconfig: config = {
    rr: {
        /** message ID */
        '000000000000000000': {
            /** emoji ID or unicode */
            '000000000000000000': {
                /** role ID */
                role: '000000000000000000',
                /** mode (see below)*/
                mode: 'NORMAL'
            }
        }
    }
};
//DO NOT EDIT BELOW THIS POINT
/*
Modes:
NORMAL: add role on reaction add, remove role on reaction remove
VERIFY: add role and remove reaction on reaction add. Do not allow role removal.
REVERSE: remove role on reaction add, add role on reaction remove
REVERSE_VERIFY: remove role and reaction on reaction remove. Do not allow role addition.
TOGGLE: toggle role and remove reaction on reaction add.
*/

export interface config {
    rr: {
        [key: string]: {
            [key: string]: ReactionRoleConfig;
        };
    };
}
export interface ReactionRoleConfig {
    role: string;
    mode: 'NORMAL' | 'VERIFY' | 'REVERSE' | 'REVERSE_VERIFY' | 'TOGGLE';
}
