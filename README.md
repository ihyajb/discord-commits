# Discord Commits Action

A GitHub Action that sends your repository's commit information to Discord via webhooks. Get real-time notifications about commits in your Discord channel.

## Features

- Sends commit information to Discord using webhooks
- Customizable embed color
- Simple setup process
- Real-time notifications

## Setup

1. In your Discord server, create a webhook:
   - Go to Server Settings > Integrations > Webhooks
   - Click "Create Webhook"
   - Copy the Webhook URL

2. In your GitHub repository:
   - Go to Settings > Secrets and Variables > Actions
   - Create a new secret named `DISCORD_WEBHOOK`
   - Paste your Discord webhook URL as the value

3. Create a workflow file at `.github/workflows/discord.yml` in your repository

## Input Parameters

### `webhook_url`
**Required**
The Discord webhook URL. Use a GitHub secret (e.g., `${{ secrets.DISCORD_WEBHOOK }}`) for security.

### `color`
Optional
The color of the Discord embed in hexadecimal format. Default is `965fb6`.

### `repo_name`
Optional
Name override for the repository name. Default is the repository name.

### `thread_id`
Optional
ID of the thread to send the message to. Default is no thread.

## Usage Example

```yaml
on: [push]

jobs:
  discord_notification:
    runs-on: ubuntu-latest
    name: Send Commit to Discord
    steps:
      - name: Send Discord Notification
        uses: ihyajb/discord-commits@test
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK }}
          color: 965fb6
          repo_name: Cool Repo
```

## Credits

This action is based on:
- [Original by baked-libs](https://github.com/baked-libs/discord-webhook)
- [Major edits by johnnyhuy](https://github.com/johnnyhuy/actions-discord-git-webhook)