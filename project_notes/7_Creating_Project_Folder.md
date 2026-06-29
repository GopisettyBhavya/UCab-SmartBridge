# Creating the Project Folder

To maintain a clean separation between the frontend and backend, the repository is structured as a **Monorepo**.

## Setup Steps
1. Create the root directory: `mkdir ucab && cd ucab`
2. Initialize Git: `git init`
3. Create the backend folder: `mkdir server`
4. Create the frontend folder: `mkdir client`

This structure allows both the Node.js API and the React application to live in the same repository while maintaining separate `package.json` dependency trees.
