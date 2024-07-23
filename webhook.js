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

        // Find the position of the first "Co-Authored-By:"
        const coAuthorIndex = commit.message.indexOf('Co-Authored-By:');

        // Remove everything before the first "Co-Authored-By:" if it exists
        const cleanMessage = coAuthorIndex !== -1
            ? commit.message.slice(0, coAuthorIndex).trim()
            : commit.message;

        // Split cleaned message into title and description
        const messageParts = cleanMessage.split('\n\n');
        const title = messageParts[0].replace(/\n/g, '');
        const description = messageParts.length > 1 ? messageParts.slice(1).join('\n\n') : '';

        // Process co-authors from the original message
        const coAuthors = commit.message.split('\n').filter(line => line.startsWith('Co-Authored-By:')).map(line => {
            const match = line.match(/Co-Authored-By: (.+?) <\/?/);
            return match ? match[1] : '';
        }).filter(Boolean);

        let coAuthorsText = coAuthors.length > 0 ? `-# Co-Authored by: ${coAuthors.join(', ')}` : '';

        // Create the formatted message
        let message = `[\`${sha}\`](${commit.url}) — ${title}`;
        if (description) {
            message += `\n${description}`;
        }
        if (coAuthorsText) {
            message += `\n${coAuthorsText}`;
        }

        changelog += message;

        // Add a blank line if this is not the last commit
        if (index < commits.length - 1) {
            changelog += '\n';
        }
    });

    return changelog;
};
