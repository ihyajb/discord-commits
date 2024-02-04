const core = require("@actions/core");
const github = require("@actions/github");
const webhooks = require('./webhook')

async function main() {
	let webhookUrl = core.getInput("webhook_url");
	const hideLinks = core.getInput("hide_links") || false;
	const color = core.getInput("color");
	const customRepoName = core.getInput("repo_name");

	let payload = github.context.payload;
	console.log(payload)

	if (customRepoName !== "") {
		payload.repository.full_name = customRepoName;
	}

	if (!webhookUrl) {
		core.setFailed("Missing webhook URL, using id and token fields to generate a webhook URL")
		process.exit(1)
	}

	await webhooks.send(
		webhookUrl,
		payload,
		hideLinks,
		color
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		core.setFailed(error)
		process.exit(1)
	});