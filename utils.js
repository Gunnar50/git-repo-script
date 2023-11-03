const { execSync } = require("child_process");
const prompt = require("prompt-sync")();

// Function to get the current global Git configuration
function getGitGlobalConfig(key) {
	try {
		const value = execSync(`git config --global --get ${key}`, {
			encoding: "utf8",
		}).trim();
		return value || null;
	} catch (error) {
		return null; // The config is not set
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
	// Check and ask for user.name
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
	// Check and ask for user.email
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

module.exports = { setName, setEmail };
