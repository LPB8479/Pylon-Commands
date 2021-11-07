# Pylon-Commands
A recreation of Carl-bot commands and features in Pylon
## Features:
- a full logging system
- customizable welcome banner originally made by `Asty'#8926`
- `ban` and `kick` commands with modlogs
- `addemoji`
- `ping`
- `cembed`
- `role` command with most if not all subcommands
- `setnick`
- reaction role in "verify" mode

## Coming Soon(ish)
- more moderation commands
- basic `embed` command
- more reaction roles
- other features upon request (if I can do it)

## Instructions
Once you have added Pylon to your server and opened the code editor, do the following for each file you want to add (note: almost all of my commands require you the `config` file):
- Create a new file
- name it `filename.ts` (the file extension is important)
- If you are adding a config file or one that has a comment labeled "config", edit the values as needed to fit your server
- Click "Publish Script" or `ctrl + s`

For all files except `logconfig`, `Astys_Welcome_Banner`, `config` and `verify_rr`:
- Open the `main.ts` file
- Add the following:
```import 'filename';```
(do NOT inclide the file extension here
