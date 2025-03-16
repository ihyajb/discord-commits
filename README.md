# Credit

[Orignal by baked-libs](https://github.com/baked-libs/discord-webhook)

[Major Edit's by johnnyhuy](https://github.com/johnnyhuy/actions-discord-git-webhook)

## 📫 Inputs

### `webhook_url`

**Required** The GitHub webhook URL comprised of both `id` and `token` fields.

### `color`

Color of the Discord embed.

## :scroll: Usage

To set up this Action, create a new workflow file under `.github/workflows/discord.yml`.

# 📄 Usage

```yaml
on: [push]

jobs:
  disord_test_message:
    runs-on: ubuntu-latest
    name: Push Commit to Discord
    steps:

      - name: Send message to discord
        uses: ihyajb/discord-commits@test 
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK }}
          color: 965fb6

```