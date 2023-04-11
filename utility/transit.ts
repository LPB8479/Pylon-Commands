import { config } from '../config/config';
function fillSpace(count: number) {
    var space = '';
    for (var spaceCount = 1; spaceCount < 11; spaceCount++) {
        if (spaceCount <= count) {
            space += ' ';
        }
    }
    return space
}

config.commands.on(
    {
        name: 'metro',
        aliases: ['wmata', 'transit'],
        description: 'Get realtime metro station arrivals'
    },
    (args) => ({
        system: args.string(),
        input: args.text()
    }),
    async (message, { system, input }) => {
        var operator = system.toLowerCase();
        if (system == 'wmata' || system == 'metro') {
            const upper = input.toUpperCase();
            // Get Alerts
            if (upper.includes('ALERT') == true || upper.includes('DELAY') == true) {
                const alertreq = await fetch('https://api.wmata.com/Incidents.svc/json/Incidents',
                    {
                        headers: {
                            api_key: config.api.wmataAPI
                        }
                    }
                );
                const alertData = await alertreq.json();
                const num = alertData.Incidents.length;
                var alertOutput = '';
                for (var step = 0; step < num; step++) {
                    var line = alertData.Incidents[step].LinesAffected;
                    var lineSymbol = line.replace(/;\s/g, ' ').replace(/;/g, '').replace('RD', '<:rd:893533778448875572>').replace('OR', '<:or:893533806781399091>').replace('YL', '<:yl:893533831783677982>').replace('GR', '<:gr:893533794303352883>').replace('BL', '<:bl:893533766402867210>').replace('SV', '<:sv:893533818932322316>');
                    var alertMessage = alertData.Incidents[step].Description;
                    var type = alertData.Incidents[step].IncidentType;
                    var timeUpdated = alertData.Incidents[step].DateUpdated;
                    alertOutput += `\n\n ${lineSymbol} \`${type}: ${alertMessage}\`\n> Updated ${timeUpdated.replace('T', ' ')}`;
                }
                var embed = new discord.Embed();
                embed.setTitle('Metrorail Alerts & Delays');
                embed.setDescription(alertOutput);
                await message.reply(embed);
            } else {
                // Get next train info
                // Parse/Sanitize Input
                const stationCodeCheck = /\d+/g.test(input);
                if (input.length == 3 && stationCodeCheck === true) {
                    // input = rtu code
                    var stationCode = upper;
                } else {
                    const reqPB = await fetch('https://pastebin.com/raw/7VNCYXxd');
                    var dataPB = await reqPB.json();
                    var stationCode: string = input.length == 3 ? dataPB.WMATA[0].customCodes[0][upper] : dataPB.WMATA[1].Stations[0][upper];
                    // input =  my station code or full station name
                }
                // Actual Request
                const req = await fetch('https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stationCode,
                    {
                        headers: {
                            api_key: config.api.wmataAPI
                        }
                    }
                );
                const data = await req.json();
                //Parse data & make message content for each train
                var output = `**Next Train: ${data.Trains[0].LocationName} (${stationCode})**`;
                for (var counter = 0; counter < 5; counter++) {
                    var line = data.Trains[counter].Line;
                    switch (line) {
                        case 'RD':
                            var lineSymbol = '<:rd:893533778448875572>';
                            break;
                        case 'OR':
                            var lineSymbol = '<:or:893533806781399091>';
                            break;
                        case 'YL':
                            var lineSymbol = '<:yl:893533831783677982>';
                            break;
                        case 'GR':
                            var lineSymbol = '<:gr:893533794303352883>';
                            break;
                        case 'BL':
                            var lineSymbol = '<:bl:893533766402867210>';
                            break;
                        case 'SV':
                            var lineSymbol = '<:sv:893533818932322316>';
                            break;
                    }
                    var dest = data.Trains[counter].Destination;
                    var trainLength = data.Trains[counter].Car;
                    var time = data.Trains[counter].Min;
                    var destLen = 11 - dest.length;
                    output += `\n${lineSymbol}    \`${trainLength} Car    ${dest}${fillSpace(destLen)}${time}\``;
                }
                message.reply(output);
            }
        } else if (system == 'septa') {
            var lower = input.toLowerCase().split(' ');
            var dir = lower[0]
            var street = lower[1]
            var validStations = ['13', '15', '19', '22', '30', '33', '36p', '36', '37', '40', '40d']
            if ((dir == "eb" || dir == "wb") == false || validStations.includes(street) == false) {
                message.reply('Invalid Input')
            } else {
                var reqPB = await fetch('https://pastebin.com/raw/7VNCYXxd');
                var dataPB = await reqPB.json();
                var locID = dataPB.SEPTA[0].Stations[0][dir][0][street]
                var reqStation = await fetch(`https://transicast.appspot.com/ws/V3/stopdetails?agency=SEPTA%20Bus&locIDs=${locID}&routes=10,11,13,34,36&appid=sample522are4`)
                var dataStation = await reqStation.json()
                var reqArrivals = await fetch(`http://transicast.appspot.com/ws/V3/arrivals?locIDs=${locID}&routes=10,11,13,34,36&agency=SEPTA%20Bus&format=json&appid=sample522are4`)
                var dataArrivals = await reqArrivals.json()
                var output = `**Next Trolley: ${dataStation.resultSet.location[0].desc}**`;
                var count = 0
                dataArrivals.forEach((arrival, parse) => {
                    var item = arrival[parse]
                    if (count > 5) {
                        if (item.scheduled > Date.now()) {
                            var line = item.route
                            var dest = item.dest.replace("13th-Market","13-Markt").replace("63rd-Malvern","63-Malvrn").replace("61st-Baltimore","61-Baltmre").replace("Darby Transportation Center","Darby TC")
                            var time = Math.floor((item.scheduled-Date.now())/60000)
                            var destLen = 15-dest.length
                            count++
                        }
                    }
                    output += `\n\`${line}    ${dest}${fillSpace(destLen)}${time}\``;
                })
                message.reply(output)
            }
        }
    }
);