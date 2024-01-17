#!/usr/bin/env node
const axios = require("axios");
const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const {
	setName,
	setEmail,
	checkAndCreateReadme,
	checkAndCreateGitIgnore,
	parseRepoUrl,
} = require("./utils");
const path = require("path");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

setName();
setEmail();

async function checkRepoExists(username, repoName) {
	const url = `https://api.github.com/repos/${username}/${repoName}`;
	try {
		const response = await axios.get(url);
		return response.status === 200;
	} catch (error) {
		return false;
	}
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
				// use the current directory if inputPath is empty
				const repoPath = inputPath.trim() === "" ? process.cwd() : inputPath;

				// check if path exists
				if (!fs.existsSync(repoPath)) {
					console.log(`The path '${repoPath}' does not exist.`);
					rl.close();
					process.exit(1);
				}

				// check if the .git directory exists
				if (fs.existsSync(path.join(repoPath, ".git"))) {
					console.log(
						`The directory '${repoPath}' is already a git repository.`
					);
					rl.close();
					process.exit(1);
				}

				// check if the repo exists
				if (!(await checkRepoExists(username, repoName))) {
					console.log(`The repository '${repoName}' does not exist.`);
					rl.close();
					process.exit(1);
				}

				// check and add readme/.gitignore to the repo
				checkAndCreateReadme(repoPath, repoName);
				checkAndCreateGitIgnore(repoPath);

				process.chdir(repoPath);

				const commands = [
					"git config --global push.default matching",
					"git config --global alias.co checkout",
					"git init",
					"git add .",
					`git commit -am "Initial commit"`,
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
