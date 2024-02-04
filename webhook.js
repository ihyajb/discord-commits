const discord = require("discord.js");
const core = require("@actions/core");
const MAX_MESSAGE_LENGTH = 256;

module.exports.send = async (webhookUrl, repository, url, commits, color) => {
    const size = commits.length;

    core.info("Constructing Embed...");

    const latest = commits[0];
    const count = size === 1 ? "" : "s";

    const authorEmbed = [
        `⚡ ${latest.author.username} pushed ${size} commit${count}`,
        `https://avatars.githubusercontent.com/${latest.author.username}`,
        `https://github.com/${latest.author.username}`,
    ];

    core.info(color);
    const embed = new discord.EmbedBuilder()
        .setDescription(this.getChangeLog(commits))
        .setColor(color)
        .setAuthor({ name: authorEmbed[0], iconURL: authorEmbed[1], url: authorEmbed[2] })
        .setTimestamp()
        .setURL(url)
        .setTitle(`📁 \`${repository}\``);

    try {
        const client = new discord.WebhookClient({ url: webhookUrl });
        core.info("Sending webhook message...");
        const result = await client.send({ embeds: [embed] });
        core.info("Successfully sent the message!");
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports.getChangeLog = (commits) => {
    core.info("Constructing Changelog...");
    let changelog = "";

    commits.forEach((commit, index) => {
        if (index > 7) {
            changelog += `+ ${commits.length - index} more...\n`;
            return;
        }

        const sha = commit.id.slice(0, 6);
        let message = commit.message.length > MAX_MESSAGE_LENGTH
            ? `${commit.message.slice(0, MAX_MESSAGE_LENGTH)}...`
            : `\`${sha}\` — ${commit.message.replaceAll('\n\n', '\n').replaceAll('\n\n', '\n')}\n\n`;

        changelog += message;
    });

    return changelog;
};