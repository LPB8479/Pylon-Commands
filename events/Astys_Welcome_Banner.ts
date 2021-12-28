import { config } from '../config/config';
discord.on('GUILD_MEMBER_ADD', async (user) => {
  //Welcome channel ID:
  const welcomeChannel = config.channel.welcome;
  //Put "yes" (without quotation marks) if you want the user's avatar to be a circle. If not, put nothing or any other value, and the avatar will display as a square instead.
  const avatarCircle = 'yes';
  //Put "yes" (without the quotation marks) if you want an outline/border on the user's avatar. If not, put whatever or empty, doesn't matter. Note: Not putting an outline can look better on avatars with some kind of transparency, but it's up to your general preference.
  const avatarOutline = 'no';
  //Thickness (in pixels) of the avatar's outline, if you want one. Don't mind this if you didn't want one above. Only put a whole number in there that fits your needs.}
  const outlineThickness = 4;
  //Outline color. Leave as is if you want it to be white. Don't mind if you didnd't want one above.
  const outlineColor = 'ffffff';
  //Severity (in pixels) of how rounded the corners of the banner should be. I personally prefer them at 5, but you can change it as per your need. Set the value below to 0 if you don't want them rounded at all.
  const roundedCorners = 5;
  //Put "yes" (without quotation marks) if you want the background color of the welcome banner to be the *main* color detected in the user's avatar! *I think that's a sick feature, I don't see why you wouldn't want it, please put yes below (◕◡◕✿)*
  const bgAdaptAvatarColor = 'yes';
  //Hex color code of the "fallback" background color, in case Cloudinary couldn't detect a main color in the user's avatar. *Please* don't put the # character in it or it will break the image URL The one I use by default "110E31" is a dark blue color. Leave it as it is if you like it.
  const defaultBGcolor = '110e31';
  //Put "yes" (without quotation marks) if you want the word "Welcome," to be shown in italics. If not, same as before, any other value or empty; doesn't matter. I personally prefer it in italics so I leave it as "yes".
  const welcomeItalic = 'yes';
  //Put "yes" if you want some shadow applied to the text. I actually highly recommend you leave it as "yes", because sometimes the main color detected in the user's avatar is really bright, effectively making the text completely invisible.
  const textShadow = 'yes';
  //Put "yes" if you want the user who just joined your server to be mentioned right above the welcome banner image. Can be useful for them to get pinged in your general or welcome channel if that is what you want.
  const shouldMention = 'yes';
  //Fill the variable below with text you want to be displayed as the embed's description, above the welcome banner. It can be useful to point the newcomer to channels links to check (with <#channelidhere>), or a nice and welcoming text. LEAVE EMPTY IF YOU DON'T WANT ANY TEXT THERE. You can even randomize the text here among some others of your choice with a "random block". More info about them there: https://docs.carl.gg/tags-and-triggers/tags-advanced-usage/#random-blocks}
  const messageAboveBanner =
        `Welcome ${user.toMention()} to the server!`;
  //--- END OF THE SETTINGS ---
  //DO NOT TOUCH anything below, unless you know what you are doing. All the configuration/settings I planned for this welcome banner is editable above. Now I'm actually *applying* your settings so they fill the image URL with what you wanted.
  const channel = await discord.getGuildTextChannel(welcomeChannel);
  const uav = user.user.getAvatarUrl(discord.ImageType.PNG);

  var bgav = bgAdaptAvatarColor == 'yes' ? ',b_auto:predominant' : '';
  var wita = welcomeItalic == 'yes' ? '_italic' : '';

  var avShape = avatarCircle == 'yes' ? ',r_max' : '';
  var outav =
    avatarOutline == 'yes'
      ? `,bo_${outlineThickness}px_solid_rgb:${outlineColor}`
      : '';
  var textshad = textShadow == 'yes' ? '/e_shadow:5,x_1,y_1,co_black' : '';

  var mention = shouldMention == 'yes' ? await channel.sendMessage(user.toMention()) : '';

  const name = user.user.username.replace(' ', '⠀');

  const banner = `https://res.cloudinary.com/demo/image/fetch/c_fill${avShape}${outav}/h_170,w_450,c_lpad${bgav},g_west,x_30,r_${roundedCorners}/l_text:Montserrat_35_medium${wita}:Welcome%252C,co_white${textshad}/fl_layer_apply,g_north,y_45,x_60/l_text:Montserrat_40_medium:${name},co_white${textshad}/fl_layer_apply,g_west,x_200,y_25,w_240,c_lfill/u_one_pixel/h_170,w_450/e_colorize,co_rgb:${defaultBGcolor}/fl_layer_apply,c_fill,r_10/${uav}`;
  var embed = new discord.Embed();
  embed.setImage({ url: banner });
  embed.setColor(0x7ed321);
  embed.setDescription(messageAboveBanner);
  if (user.user.bot == false) {await channel.sendMessage(embed);}
});
