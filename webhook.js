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

        // Split commit.message into parts and remove "Co-Authored-By" lines
        let messageParts = commit.message.split('\n\n');
        const title = messageParts[0].replace(/\n/g, '');

        // Extract and remove co-author lines
        let coAuthorsText = '';
        const coAuthors = commit.message.split('\n').filter(line => line.startsWith('Co-Authored-By:')).map(line => {
            const match = line.match(/Co-Authored-By: (.+?) <\/?/);
            return match ? match[1] : '';
        }).filter(Boolean);

        if (coAuthors.length > 0) {
            coAuthorsText = `-# Co-Authors: ${coAuthors.join(', ')}\n`;
        }

        // Determine the description by excluding co-authored lines
        let description = messageParts.slice(1).join('\n\n').split('\n').filter(line => !line.startsWith('Co-Authored-By:')).join('\n');

        // Create the formatted message
        let message = `[\`${sha}\`](${commit.url}) — ${title}`;
        if (description) {
            message += `\n${description}`;
        }
        if (coAuthors.length > 0) {
            message += `\n${coAuthorsText}`;
        } else {
            message += '\n';
        }

        changelog += message;

        // Add a blank line if this is not the last commit
        if (index < commits.length - 1) {
            changelog += '\n';
        }
    });

    return changelog;
};

//test1
//test2
//test3
//test4