const discord = require("discord.js");
const core = require("@actions/core");
const MAX_MESSAGE_LENGTH = 256;

module.exports.send = async (webhookUrl, repository, pusher, commits, color) => {
    const size = commits.length;

    core.info("Constructing Embed...");

    // const latest = commits[0];

    const count = size === 1 ? "" : "s";

    const authorEmbed = [
        `⚡ ${pusher} pushed ${size} commit${count}`,
        `https://avatars.githubusercontent.com/${pusher}`,
        `https://github.com/${pusher}`,
    ];

    core.info(color);
    const embed = new discord.EmbedBuilder()
        .setDescription(this.getChangeLog(commits))
        .setColor(color)
        .setAuthor({ name: authorEmbed[0], iconURL: authorEmbed[1], url: authorEmbed[2] })
        .setTimestamp()
        .setTitle(`\`📂: ${repository}\``);

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

        // Split commit.message into title, description, and co-authors
        const messageParts = commit.message.split('\n\n');
        const title = messageParts[0].replace(/\n/g, '');
        const description = messageParts[1] || '';

        // Process co-authors if any
        let coAuthorsText = '';
        const coAuthors = [];
        for (let i = 2; i < messageParts.length; i++) {
            const match = messageParts[i].match(/Co-Authored-By: (.+?) </);
            if (match) {
                coAuthors.push(match[1]);
            }
        }
        if (coAuthors.length > 0) {
            coAuthorsText = coAuthors.map(author => `-# Co-Authored: ${author}`).join('\n') + '\n';
        }

        // Create the formatted message
        let message = commit.message.length > MAX_MESSAGE_LENGTH
            ? `${commit.message.slice(0, MAX_MESSAGE_LENGTH)}...`
            : `[\`${sha}\`](${commit.url}) — ${title}\n${description}\n${coAuthorsText}`;

        changelog += message;
    });

    return changelog;
};