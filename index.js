const core = require("@actions/core");
const github = require("@actions/github");
const webhooks = require('./webhook')

async function main() {
	let webhookUrl = core.getInput("webhook_url");
	const color = core.getInput("color");
	const customRepoName = core.getInput("repo_name");

	const payload = github.context.payload
	const commits = payload.commits
	const size = commits.length

	console.log(`Received payload.`)
	console.log(`Received ${commits.length}/${size} commits...`)
	console.log(`------------------------`)
	console.log(`Full payload: ${JSON.stringify(commits, null, 2)}`)
	console.log(`------------------------`)

	if (customRepoName !== "") {
		payload.repository.full_name = customRepoName;
	}

	if (!webhookUrl) {
		core.setFailed("Missing webhook URL, using id and token fields to generate a webhook URL")
		process.exit(1)
	}

	if (commits.length === 0) {
		console.log(`No commits, skipping...`)
		return
	  }
	//   if (payload.sender.type === 'Bot') {
	// 	console.log(`Commit by bot, skipping...`)
	// 	return
	//   }

	await webhooks.send(
		webhookUrl,
		payload.repository.full_name,
		// payload.compare,
		payload.pusher.name,
		commits,
		color
	);
}

try {
	main()
} catch (error) {
	core.setFailed(error.message)
}