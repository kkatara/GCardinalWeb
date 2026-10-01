# Green Cardinal KE Website

Official website for **Green Cardinal KE**, the Kenyan chapter of Climate Cardinals. The website provides information about the organization, programs, projects, campaigns, events, resources, and opportunities, and serves as a platform for public engagement and communication.

---

## 1. Requirements

Before running the project, install:

* **Node.js LTS** — includes npm
* **Git**
* **Visual Studio Code** or another code editor
* A modern web browser such as Chrome, Edge, Firefox, or Safari

Verify the installations:

```bash
node -v
npm -v
git --version
```

If all three commands return version numbers, the environment is ready.

---

## 2. Clone the Repository

Clone the repository from GitHub:

```bash
git clone <REPOSITORY-URL>
```

Enter the project directory:

```bash
cd <PROJECT-FOLDER>
```

Example:

```bash
cd "G.Cardinal Website"
```

Then open the project in VS Code:

```bash
code .
```

If the `code` command is unavailable, open VS Code manually and select:

**File → Open Folder → Project Folder**

---

## 3. Install Dependencies

From the project root directory, run:

```bash
npm install
```

This installs all dependencies listed in `package.json`.

You normally only need to run `npm install`:

* After cloning the repository for the first time
* After `package.json` or `package-lock.json` changes
* When dependencies have been added or removed
* When setting up the project on another computer

---

## 4. Run the Website Locally

Start the development server:

```bash
npm run dev
```

The terminal will display a local URL, for example:

```text
Local: http://localhost:5173/
```

or:

```text
Local: http://localhost:8081/
```

**Always use the URL displayed by the terminal. Do not assume the port number.**

Open the URL in Chrome or another browser.

The website is now running locally.

### Stop the development server

In the VS Code terminal, press:

```text
Ctrl + C
```

---

## 5. Development Workflow

The normal development workflow is:

```text
Pull latest code
        ↓
Install dependencies if required
        ↓
Run local development server
        ↓
Make changes in VS Code
        ↓
Test on localhost
        ↓
Build the project
        ↓
Commit changes
        ↓
Push to GitHub
        ↓
Deploy through the configured hosting platform
```

Start development with:

```bash
git pull
npm run dev
```

After making changes, test all affected pages before committing.

---

## 6. Build for Production

Before deploying a major change, create a production build:

```bash
npm run build
```

If the build completes successfully, the project is ready for deployment.

If the project supports previewing the production build, run:

```bash
npm run preview
```

Do not deploy if the production build contains errors.

---

## 7. Common npm Commands

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm install`     | Install project dependencies     |
| `npm run dev`     | Start local development server   |
| `npm run build`   | Create production build          |
| `npm run preview` | Preview production build locally |
| `npm run`         | Display available npm scripts    |

The exact commands available depend on the scripts defined in `package.json`.

---

## 8. Making Website Changes

Website content and components are located within the project's source files.

Before editing, identify where the relevant content is stored.

Common locations include:

```text
src/
├── components/
├── pages/
├── assets/
├── App.*
└── ...
```

Images may be stored in:

```text
src/assets/
```

or:

```text
public/
```

Styles may be located in CSS files or within the relevant components.

**Do not move, rename, or delete project files unless you understand their dependencies.**

For major structural changes, create a separate Git branch first.

Example:

```bash
git checkout -b update-homepage
```

---

## 9. Git Workflow

Check which files have changed:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit the changes:

```bash
git commit -m "Update homepage content"
```

Push to GitHub:

```bash
git push
```

Use descriptive commit messages.

Examples:

```text
Update homepage content
Fix mobile navigation
Add climate education program
Update contact information
Fix newsletter form
Improve mobile responsiveness
```

Avoid vague commit messages such as:

```text
update
changes
fix
new
```

---

## 10. Keeping Your Local Project Updated

Before starting work, always get the latest version:

```bash
git pull
```

Then run:

```bash
npm run dev
```

If dependency files have changed, run:

```bash
npm install
```

Do not overwrite other people's changes if multiple developers are working on the repository.

---

## 11. Environment Variables and Secrets

Sensitive credentials must **never** be committed to GitHub.

Examples include:

```text
API keys
Database credentials
Newsletter API keys
Authentication secrets
Admin credentials
Private tokens
```

Local environment variables should normally be stored in a file such as:

```text
.env
```

Ensure the file is included in `.gitignore`:

```text
.env
.env.local
```

Never place secret API keys directly in frontend JavaScript, React components, HTML, or other publicly accessible source files.

If a secret is accidentally pushed to GitHub, assume it is compromised and immediately revoke or rotate it.

---

## 12. Localhost Troubleshooting

### Problem: `npm` is not recognized

Example:

```text
npm : The term 'npm' is not recognized...
```

Install Node.js LTS and restart VS Code.

Verify:

```bash
node -v
npm -v
```

---

### Problem: Website does not load

First stop the server:

```text
Ctrl + C
```

Then restart:

```bash
npm run dev
```

Use the exact localhost URL displayed by the terminal.

---

### Problem: Application error in Chrome

Open Chrome Developer Tools:

```text
F12 → Console
```

Check for red error messages.

Also check the VS Code terminal for errors such as:

```text
Module not found
Failed to compile
SyntaxError
ReferenceError
Internal server error
```

Do not immediately change code without identifying the error.

---

### Problem: Dependencies are missing

Run:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

### Problem: Production build fails

Run:

```bash
npm run build
```

Read the error reported in the terminal.

Fix the underlying issue before pushing the change to production.

---

## 13. Deployment

The production website should be connected to the GitHub repository through the selected hosting platform.

Recommended deployment flow:

```text
VS Code
   ↓
Local testing
   ↓
Git commit
   ↓
GitHub
   ↓
Hosting platform
   ↓
Production website
```

Once automatic deployment is configured, pushing a change to the production branch will trigger a new deployment.

Always check the deployment status after pushing a significant change.

---

## 14. Production Checklist

Before deploying a major update, confirm:

* [ ] `npm run build` succeeds
* [ ] Homepage works
* [ ] Navigation works
* [ ] Images load correctly
* [ ] Buttons and links work
* [ ] Forms work
* [ ] Newsletter signup works
* [ ] Mobile layout works
* [ ] No major browser console errors
* [ ] No credentials are exposed
* [ ] Contact information is correct
* [ ] Social media links work
* [ ] New content has been proofread

After deployment, test the live website again.

---

## 15. Security

All contributors should follow these rules:

1. Never commit passwords or API keys.
2. Never share GitHub credentials.
3. Enable two-factor authentication on GitHub.
4. Use individual accounts instead of shared administrator accounts.
5. Keep dependencies reasonably up to date.
6. Review GitHub security/dependency alerts.
7. Use HTTPS on the production website.
8. Limit administrator access.
9. Use environment variables for secrets.
10. Regularly back up important website content and configuration.

---

## 16. Content Management

If a CMS or admin dashboard is connected to the website, use it for routine content updates such as:

* News
* Events
* Projects
* Announcements
* Opportunities
* Images
* Team information

Code changes should be reserved for:

* Design changes
* New functionality
* Structural changes
* Bug fixes
* Integrations
* Security updates

Only authorized users should have administrator access.

---

## 17. Newsletter Integration

The newsletter system should be connected through a secure email/newsletter service.

The website should not store newsletter credentials directly in frontend code.

Newsletter functionality should support:

* Subscriber signup
* Email validation
* Secure subscriber handling
* Unsubscribe functionality
* Spam protection
* Privacy-conscious data collection

If an API is required, keep the API credentials in environment variables or a secure server-side integration.

---

## 18. Recommended Maintenance

### Every development session

```bash
git pull
npm run dev
```

Test changes locally before committing.

### Before pushing

```bash
git status
npm run build
```

Then:

```bash
git add .
git commit -m "Describe the change"
git push
```

### Regularly

Review:

* Website functionality
* Broken links
* Forms
* Newsletter signup
* Security alerts
* Dependencies
* Domain/SSL status
* Website content
* Mobile responsiveness
* Backups

---

## 19. Project Structure

The project structure may vary depending on the framework. A typical structure may look like:

```text
green-cardinal-ke-website/
│
├── public/
│   └── static assets
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── styles/
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── ...
```

Do not assume every project uses exactly this structure. Refer to the actual files in the repository.

---

## 20. Contribution Rules

Before contributing:

1. Pull the latest changes.
2. Create a branch for significant work.
3. Make the changes.
4. Test locally.
5. Run the production build.
6. Commit with a clear message.
7. Push the branch.
8. Review the changes before merging.

For major changes, use a pull request rather than directly modifying the production branch.

---

## 21. Quick Start

For an experienced developer who has already installed Node.js and Git:

```bash
git clone <REPOSITORY-URL>
cd <PROJECT-FOLDER>
npm install
npm run dev
```

Open the localhost URL shown in the terminal.

After making changes:

```bash
git add .
git commit -m "Describe the changes"
git push
```

For a production check:

```bash
npm run build
```

---

## 22. Important Notes

* The localhost URL is only accessible from the computer running the development server.
* The localhost port may change depending on the project configuration.
* GitHub stores the project's source code; it does not automatically mean the website is live.
* The hosting platform is responsible for serving the production website.
* Never commit secrets or private credentials.
* Always test significant changes locally before deploying.
* Keep the production branch stable.
* Make backups before major structural changes.

---

## Green Cardinal KE Website Workflow

```text
                 ┌─────────────────┐
                 │     VS CODE     │
                 │  Edit Website   │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │    LOCALHOST    │
                 │     TESTING     │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │     GITHUB      │
                 │ Version Control │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │    HOSTING      │
                 │   DEPLOYMENT    │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │  CUSTOM DOMAIN  │
                 │ LIVE WEBSITE    │
                 └─────────────────┘
```

**Primary rule:** Never push untested code directly to production. Develop → test → build → commit → push → deploy → verify.
