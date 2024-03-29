# Pylon-Commands
A moderation and utility bot made with Pylon
## Features:
- A full logging system
- Customizable welcome banner originally made by `Asty'#8926`
- Customizable and modular reaction role system
- automod and `warn`, `ban` and `kick` commands with modlogs
- `addemoji`
- `ping`
- `embed` and `cembed`
- `role` command with most if not all subcommands
- `setnick`
- `echo`
- `react` (adds a reaction to any message)
- `clonechannel` (creates a new channel with permissions copied from another channel)
- `color` (converts and gets information about a specified color)
- and more

## Additional features and changes:
I'd love for this system to work in many servers, not just mine. If you would like to request an addition or would like to suggest a change, please add it under the "Issues" tab. If you know JavaScript/TypeScript and are willing to contribute, please make a pull request and I'll review it as soon as I can.

## Instructions:
Once you have added Pylon to your server and opened the code editor, do the following for each file you want to add (note: All commands need you to add the entire functions folder and the config/config file. Automod and logging also have their own config files which you need to add. Be sure to keep the folder structure as shown in the repo.):
- Create a new file
- Name it `foldername/filename.ts` (the file extension is important)
- Copy and paste the code from Github into the code editor
- If you are adding a config file or one that has a comment labeled "config", edit the values as needed to fit your server
- Click "Publish Script" or `ctrl + s`

For all files except config and function files:
- Open the `main.ts` file
- Add the following:
```import 'foldername/filename';```
(do NOT include the file extension here)

**Be sure to watch this repo or check back occasionally for updates and additions**
#### Huge thanks to Asty`#8926, asportnoy#6969 and Juno#6096 for their help
