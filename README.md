# Pylon-Commands
A recreation of Carl-bot commands and features in Pylon
## Features:
- A full logging system
- Customizable welcome banner originally made by `Asty'#8926`
- `ban` and `kick` commands with modlogs
- `addemoji`
- `ping`
- `cembed`
- `role` command with most if not all subcommands
- `setnick`
- Reaction role in "verify" mode

## To do list:
- Simplify all code with template literals
- Fetch & attach image for welcome
- Make more moderation commands
- Make basic `embed` command
- Make more reaction roles
- Other features upon request (if I can do it)

## Instructions
Once you have added Pylon to your server and opened the code editor, do the following for each file you want to add (note: almost all of my commands require you the `config` file):
- Create a new file
- Name it `filename.ts` (the file extension is important)
- Copy and paste the code from Github into the code editor
- If you are adding a config file or one that has a comment labeled "config", edit the values as needed to fit your server
- Click "Publish Script" or `ctrl + s`

For all files except `logconfig`, `Astys_Welcome_Banner`, `config` and `verify_rr`:
- Open the `main.ts` file
- Add the following:
```import 'filename';```
(do NOT inclide the file extension here)
