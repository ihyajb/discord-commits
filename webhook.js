const discord = require("discord.js");
const core = require("@actions/core");
const MAX_MESSAGE_LENGTH = 256;

module.exports.send = async (webhookUrl, payload, hideLinks, color) => {
    const repository = payload.repository.full_name;
    const commits = payload.commits;
    const size = commits.length;
    // const branch = payload.ref.split("/").pop();
    const url = payload.compare;

    if (size === 0) {
        core.warning(`Aborting analysis, found no commits.`);
    }

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
        .setDescription(this.getChangeLog(payload, hideLinks))
        .setColor(color)
        .setAuthor({ name: authorEmbed[0], iconURL: authorEmbed[1], url: authorEmbed[2] })
        .setTimestamp()
        .setTitle(`📁 \`${repository}\``);

    if (!hideLinks) {
        embed.setURL(url);
    }

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

module.exports.getChangeLog = (payload, hideLinks) => {
    core.info("Constructing Changelog...");
    const commits = payload.commits;
    let changelog = "";

    commits.forEach((commit, index) => {
        if (index > 7) {
            changelog += `+ ${commits.length - index} more...\n`;
            return;
        }

        const repository = payload.repository;

        if (commit.message.includes(repository.full_name) && hideLinks) {
            const firstRepository = repository.full_name[0];
            const lastRepository = repository.full_name.slice(-1);
            commit.message = commit.message.replace(new RegExp(repository.full_name, 'g'), `${firstRepository}...${lastRepository}`);
        }

        const sha = commit.id.slice(0, 6);
        let message = commit.message.length > MAX_MESSAGE_LENGTH
            ? `${commit.message.slice(0, MAX_MESSAGE_LENGTH)}...`
            : `\`${sha}\` — ${commit.message.replaceAll('\n\n', '\n').replaceAll('\n\n', '\n')}\n\n`;

        changelog += message;
    });

    return changelog;
};


// Test
// Test
// Test
// Test
// Test
