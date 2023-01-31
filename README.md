# Credit

[Orignal](baked-libs/discord-webhook) by baked-libs

[Major Edit](baked-libs/discord-webhook) by johnnyhuy

## 📫 Inputs

### `webhook_url`

**Required** The GitHub webhook URL comprised of both `id` and `token` fields.

### `id`

> This is ignored if `webhook_url` is set

**Required** This is the id of your Discord webhook, if you copy the webhook url, this will be the first part of it.

### `token`

> This is ignored if `webhook_url` is set

**Required** Now your Discord webhook token, it's the second part of the url. 

### `censor_username`

Censor username with by only showing the first and last character. For example, `i...b` as `ihyajb`.

### `repo_name`

Specify a custom repository name to overwrite the `username/repo` format.

### `hide_links`

Hide links on embedded view.

### `color`

Color of the Discord embed.

## :scroll: Usage

To set up this Action, create a new workflow file under `.github/workflows/workflow_name.yml`.

# 📄 Usage

```yaml
on: [push]

jobs:
  disord_test_message:
    runs-on: ubuntu-latest
    name: Ajs Discord Commits
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Use Node
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install NPM Dependencies (prod)
        run: npm install --frozen-lockfile --production
      - name: Send message to discord
        uses: ./ # Uses an action in the root directory
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK }}
          hide_links: true
          censor_username: false

```