import { decimalToHex } from "../functions/decimalToHex"
export async function displayColor(member:discord.GuildMember) {
    var roleArray = member.roles
    for (var count = 0; count < roleArray.length; count++) {
        var guild = await discord.getGuild()
        var role = await guild.getRole(roleArray[count])
        var color = role?.color
        if (color != 0) {break}
    }
    return color
}