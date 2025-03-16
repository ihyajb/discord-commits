const core = require("@actions/core");
const webhooks = require('../webhook');
const fs = require('fs');
const path = require('path');

// Mock core module manually without Jest
const originalCoreModule = { ...core };
const mockInputs = {
  "webhook_url": "https://discord.com/api/webhooks/1350538058134585405/2ZneTNQZPjYhk_caQ66TcuIL9TxV-bAY5e-dAi1ultTMMBp0vgJc9X1cpf4if_jAS7CH",
  "color": "7dbbe6",
  "repo_name": ""
};

// Override core.getInput
core.getInput = (name) => mockInputs[name] || "";
core.info = (message) => console.log(`[INFO] ${message}`);
core.setFailed = (message) => console.error(`[FAILED] ${message}`);

// Load the GitHub webhook payload from JSON file
const jsonPath = path.join(__dirname, 'json', 'github_webhook_full.json');
const webhookPayload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function runTest() {
  console.log("Running test with GitHub webhook payload from JSON file...");

  try {
    await webhooks.send(
      core.getInput("webhook_url"),
      webhookPayload.repository.full_name,
      webhookPayload.forced,
      webhookPayload.pusher.name,
      webhookPayload.commits,
      core.getInput("color")
    );
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    console.error(error.stack);
  }
}

runTest();