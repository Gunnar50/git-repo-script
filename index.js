#!/usr/bin/env node
const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
import { setEmail, setName } from "./utils";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

setName();
setEmail();

async function checkRepoExists(repoUrl) {
	try {
		await axios.get(repoUrl);
		return true;
	} catch (error) {
		return false;
	}
}

function parseRepoUrl(repoUrl) {
	// Assumes a standard GitHub repository URL like "https://github.com/username/repo"
	const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
	return match ? { username: match[1], repoName: match[2] } : null;
}

rl.question(
	"Enter the full GitHub repo URL (https://github.com/username/repo): ",
	async (repoUrl) => {
		const parsedUrl = parseRepoUrl(repoUrl);

		if (!parsedUrl) {
			console.error("Invalid GitHub repo URL.");
			rl.close();
			process.exit(1);
		}

		const { username, repoName } = parsedUrl;

		rl.question(
			"Enter the local repo path (leave it empty to use the current directory): ",
			async (inputPath) => {
				// Use the current directory if inputPath is empty
				const repoPath = inputPath.trim() === "" ? process.cwd() : inputPath;

				if (!fs.existsSync(repoPath)) {
					console.log(`The path '${repoPath}' does not exist.`);
					rl.close();
					process.exit(1);
				}

				if (!(await checkRepoExists(repoUrl))) {
					console.log(`The repository '${repoName}' does not exist.`);
					rl.close();
					process.exit(1);
				}

				process.chdir(repoPath);

				const commands = [
					`git config --global user.name "${name}"`,
					`git config --global user.email "${email}"`,
					"git config --global push.default matching",
					"git config --global alias.co checkout",
					"git init",
					"git add .", // Add all
					`git commit -am "Initial commit"`, // Commit with a comment
					`git remote add origin ${repoUrl}`,
					"git branch -M main",
					"git push -u origin main",
				];

				try {
					for (const command of commands) {
						console.log("Executing: " + command);
						execSync(command, { stdio: "inherit" });
					}
					console.log("Repository setup complete!");
				} catch (error) {
					console.error(`Error executing command: ${error}`);
					process.exit(1);
				}

				rl.close();
			}
		);
	}
);
