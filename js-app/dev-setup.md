## One-Time Setup

### Cloning the repo

TL;DR
mkdir ~/workspace
cd ~/workspace && git clone ...
// run as admin in powershell

Explanation:
The repository is where we we host our code. This is how we're going to collaborate, like a google docs but for code.

### Installing Chocolatey

This is a package manager. This is basically a much more streamlined way of telling you "go to this webpage, go through the installation wizard, etc."

choco install -y git vscode # git is our version control. vscode is the editor.
choco install -y nodejs yarn # this is our javascript env.

### Getting your app running

yarn install # this installs all our dependencies needed to run our project

## Dev setup

yarn start
