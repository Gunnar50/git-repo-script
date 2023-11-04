const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const prompt = require("prompt-sync")();

// Fget the current global Git configuration
function getGitGlobalConfig(key) {
	try {
		const value = execSync(`git config --global --get ${key}`, {
			encoding: "utf8",
		}).trim();
		return value || null;
	} catch (error) {
		return null;
	}
}

// Function to set the global Git configuration
function setGitGlobalConfig(key, value) {
	try {
		execSync(`git config --global ${key} "${value}"`, { stdio: "inherit" });
	} catch (error) {
		console.error(
			`Error setting Git global config for ${key}: ${error.message}`
		);
	}
}

function setName() {
	// check and ask for user name
	const userName = getGitGlobalConfig("user.name");
	if (!userName) {
		const name = prompt("Enter your Git user.name: ");
		if (name) {
			setGitGlobalConfig("user.name", name);
		}
	} else {
		console.log(`Git user.name is already set to: ${userName}`);
	}
}

function setEmail() {
	// check and ask for user email
	const userEmail = getGitGlobalConfig("user.email");
	if (!userEmail) {
		const email = prompt("Enter your Git user.email: ");
		if (email) {
			setGitGlobalConfig("user.email", email);
		}
	} else {
		console.log(`Git user.email is already set to: ${userEmail}`);
	}
}

function checkAndCreateReadme(repoPath, repoName) {
	const readmePath = path.join(repoPath, "README.md");
	if (!fs.existsSync(readmePath)) {
		fs.writeFileSync(readmePath, `# ${repoName}\n`);
		console.log("README.md created.");
	}
}

function parseRepoUrl(repoUrl) {
	const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
	return match ? { username: match[1], repoName: match[2] } : null;
}

module.exports = { setName, setEmail, checkAndCreateReadme, parseRepoUrl };
