const discord = require("discord.js");
const core = require("@actions/core");
const MAX_MESSAGE_LENGTH = 256;

module.exports.send = async (webhookUrl, repository, pusher, commits, color) => {
    const size = commits.length;

    core.info("Constructing Embed...");

    const count = size === 1 ? "" : "s";

    const authorEmbed = [
        `⚡ ${pusher} pushed ${size} commit${count}`,
        `https://avatars.githubusercontent.com/${pusher}`,
        `https://github.com/${pusher}`,
    ];

    core.info(color);
    const { changelog, coAuthors } = this.getChangeLog(commits);

    const embed = new discord.EmbedBuilder()
        .setDescription(changelog)
        .setColor(color)
        .setAuthor({ name: authorEmbed[0], iconURL: authorEmbed[1], url: authorEmbed[2] })
        .setTimestamp()
        .setTitle(`\`📂: ${repository}\``)
        .setFooter({ text: coAuthors.join('\n') || 'No co-authors' });

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
    const coAuthors = new Set();

    commits.forEach((commit, index) => {
        if (index > 7) {
            changelog += `+ ${commits.length - index} more...\n`;
            return;
        }

        const sha = commit.id.slice(0, 6);

        // Split commit.message into title, details, and co-author
        const [titleWithNewlines, detailsAndCoAuthor] = commit.message.split('\n\n');

        // Remove newlines from the title
        const title = titleWithNewlines.replace(/\n/g, '');

        const detailsParts = detailsAndCoAuthor?.split('\n\nCo-Authored-By: ') || [];
        const details = detailsParts[0] ?? '';
        const coAuthor = detailsParts[1] ?? '';

        if (coAuthor) {
            coAuthors.add(`Co-Authored-By: ${coAuthor}`);
        }

        const sanitizedDetails = details;

        let message = `${commit.message.length > MAX_MESSAGE_LENGTH ? commit.message.slice(0, MAX_MESSAGE_LENGTH) + '...' : `[${sha}](${commit.url}) — ${title}\n${sanitizedDetails}\n`}`;

        changelog += message;
    });

    return { changelog, coAuthors: Array.from(coAuthors) };
};