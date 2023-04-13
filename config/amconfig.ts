/*IMPORTANT:
This is not a fully finished system. The following features have not yet been made:
    - tempmute
    - tempban
*/
import { config } from '../config/config';
export const amConfig = {

    kv: {
        modlog: config.kv.modlog,
        drama: config.kv.drama,
        tempmute: config.kv.tempmute
    },
    config: {
        modlogchannel: config.channel.modlog,
        dramachannel: config.channel.drama,
        muterole: config.role.modRole,
        whitelistedchannels: ['000000000000000000'],
        whitelistedroles: [config.role.modRole, '000000000000000000']
    },
    badwords: {
        wordlist: ["sample", "word", "list"],
        punish: {
            deleteMessage: false,
            warn: false,
            tempmute: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            mute: false,
            kick: false,
            tempban: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            ban: false,
            defer: false, 
            message: [
                false,
                `^user, please don't do that`
            ]
        }
    },
    badlinks: {
        mode: 'blacklist|whitelist',
        domains: [
            'google.com'
        ],
        punish: {
            deleteMessage: false,
            warn: false,
            tempmute: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            mute: false,
            kick: false,
            tempban: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            ban: false,
            defer: false, 
            message: [
                false,
                `^user, please don't do that`
            ]
        }
    },
    badinvites: {
        mode: 'blacklist|whitelist',
        serverIDs: [
            '000000000000000000'
        ],
        punish: {
            deleteMessage: false,
            warn: false,
            tempmute: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            mute: false,
            kick: false,
            tempban: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            ban: false,
            defer: false, 
            message: [
                false,
                `^user, please don't do that`
            ]
        }
    },
    capsspam: {
        limit: 50/*%*/,
        punish: {
            deleteMessage: false,
            warn: false,
            tempmute: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            mute: false,
            kick: false,
            tempban: [ /*Not completed*/
                false,
                10 /*minutes*/
            ],
            ban: false,
            defer: false, 
            message: [
                false,
                `^user, please don't do that`
]
        }
    },
    scaryfiles: {
        delete/*?*/: false,
        validExtensions: ["png",
            "jpg",
            "jpeg",
            "webm",
            "mp4",
            "gif",
            "bmp",
            "pdf",
            "txt",
            "tif",
            "svg",
            "webp",
            "mp3",
            "flac",
            "wav"
        ]
    },
};
