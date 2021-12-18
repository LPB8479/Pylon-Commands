# Pylon-Commands
A recreation of Carl-bot commands and features in Pylon
## Features:
- A full logging system
- Customizable welcome banner originally made by `Asty'#8926`
- `ban` and `kick` commands with modlogs
- `addemoji`
- `ping`
- `embed` and `cembed`
- `role` command with most if not all subcommands
- `setnick`
- `echo`
- Reaction role in "verify" mode
- `react` (adds a reaction to any message)
- `clonechannel` (creates a new channel with permissions copied from another channel)
- `color` (converts and gets information about a specified color)

## Additional features and changes:
I'd love for this system to work in many servers, not just mine. If you would like to request an addition or would like to suggest a change, please add it under the "Issues" tab. If you know typescript and are willing to contribute, please make a pull request and I'll review it as soon as I can.

## Instructions:
Once you have added Pylon to your server and opened the code editor, do the following for each file you want to add (note: all of these commands require you to add the `config` file, and the logging system requires the `logconfig` file):
- Create a new file
- Name it `filename.ts` (the file extension is important)
- Copy and paste the code from Github into the code editor
- If you are adding a config file or one that has a comment labeled "config", edit the values as needed to fit your server
- Click "Publish Script" or `ctrl + s`

For all files except `logconfig`and `config`:
- Open the `main.ts` file
- Add the following:
```import 'filename';```
(do NOT include the file extension here)


#### Huge thanks to Asty`#8926 and asportnoy#6969 for their help