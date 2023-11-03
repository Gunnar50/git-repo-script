#!/usr/bin/env node
const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const name = "Gustavo Passarella";
const email = "gustavo.passarella@hotmail.com";
const githubUsername = "Gunnar50"; // Replace with actual GitHub username

async function checkRepoExists(username, repoName) {
	const url = `https://api.github.com/repos/${username}/${repoName}`;
	try {
		const response = await fetch(url);
		return response.status === 200;
	} catch (error) {
		return false;
	}
}

rl.question("Enter the repo name: ", async (repoName) => {
	rl.question("Enter the repo path: ", async (repoPath) => {
		if (!fs.existsSync(repoPath)) {
			console.log(`The path '${repoPath}' does not exist.`);
			process.exit(1);
		}

		if (!(await checkRepoExists(githubUsername, repoName))) {
			console.log(`The repository '${repoName}' does not exist.`);
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
			`git remote add origin https://github.com/${githubUsername}/${repoName}.git`,
			"git branch -M main",
			"git push -u origin main",
		];

		try {
			for (const command of commands) {
				console.log(command);
				execSync(command, { stdio: "inherit" });
			}
			console.log("Done");
		} catch (error) {
			console.error(`Error executing command: ${error}`);
			process.exit(1);
		}

		rl.close();
	});
});
