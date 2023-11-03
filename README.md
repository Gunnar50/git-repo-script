# Git Repo Script

This script automates the process of initializing a local directory as a Git repository and linking it to an existing GitHub repository.

## Prerequisites

**Before you begin, ensure you have met the following requirements:**

- You have [Node.js and npm](https://nodejs.org/) installed on your system.
- You have [Git](https://git-scm.com/) installed and configured on your system.

## Installing Git Repo Script Globally

To install the script globally on your machine, run the following command:

```sh
npm install -g https://github.com/Gunnar50/git-repo-script.git
```

Once installed, you can run the script from anywhere on your system by simply typing:

```sh
create-git-repo
```

## Using Git Repo Script Without Installation

If you prefer to run the script without installing it globally, you can use npx which comes with npm 5.2+ and higher. Navigate to the directory where you want to initialize your repository and run:

```sh
npx https://github.com/Gunnar50/git-repo-script.git
```

This will execute the script once without installing it globally.

## How to Use

Before using the script, make sure you have created an empty repository on GitHub. **Do not initialize the repository with a README, .gitignore, or license.** The script will add a README.md file if one is not present.

After installing, run `create-git-repo` and follow the on-screen prompts. Enter the GitHub repository URL when asked, and if you want to use the current directory, just press Enter when prompted for the repository path.

## Support

If you have any issues or questions, please open an issue on the GitHub repository.
