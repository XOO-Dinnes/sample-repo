# Test Summary Report
**Project:** Sample Repo / Gitfolio (Test Project)
**Date:** June 3–4, 2026
**Purpose:** Practice and prove the migration workflow before touching the real project (Blackbox)

---

## 1. What This Test Was About

We did NOT touch the real Blackbox project.

We used a **separate test project** (a simple portfolio website called Gitfolio) to safely practice and prove the full workflow of:
- Managing code with branches and pull requests
- Connecting a code repository to Bitbucket and GitHub
- Automatically building and shipping code to Amazon Web Services when changes are pushed

Everything done here was on **free accounts** with **no real production impact.**

---

## 2. What Accounts and Tools We Used

| Tool | Account Type | Limitation |
|---|---|---|
| Bitbucket | Free workspace (`sampleaws`) | 50 pipeline minutes per month |
| GitHub | Free account (`XOO-Dinnes`) | No pipeline minute limits on public repos |
| Amazon Web Services | Free tier (account: `364046407464`) | Only test resources created |
| Amazon Elastic Container Registry | Free tier | 1 test repo (`test-repo`) created |
| Amazon Identity and Access Management | Free | 1 test user (`ist-testing`) created |

---

## 3. Scope of What We Tested

### What We Did
```
✓ Created a test project on both GitHub and Bitbucket
✓ Practiced branching — 4 branches, 4 commits, 4 pull requests, 4 merges
✓ Connected Bitbucket to Amazon Web Services (pipeline proved working)
✓ Connected GitHub to Amazon Web Services (pipeline proved working)
✓ Built a Docker image automatically when code was pushed
✓ Pushed the Docker image to Amazon Elastic Container Registry
✓ Confirmed image appeared in Amazon Web Services console
```

### What We Did NOT Test (Out of Scope)
```
✗ Deploying to Amazon Elastic Container Service (running the app live)
✗ Multiple environments (dev, staging, production)
✗ Backend code (Go/Revel) — test project is frontend only
✗ Real secrets from Amazon SSM Parameter Store
✗ The actual Blackbox project code
```

---

## 4. Step by Step — What We Did

### Part 1 — Git Practice
1. Cloned the Gitfolio template from GitHub
2. Pushed it to our own GitHub account
3. Created a Bitbucket workspace and pushed the same project there
4. Created 4 branches — each person made 1 small visible change:
   - `update-nav` — changed the navigation title and header color
   - `update-contact` — changed button color and text
   - `update-projects` — updated project cards
   - `update-about` — updated skills section
5. Created Pull Requests on Bitbucket for each branch
6. Reviewed and merged all 4 into `main`

### Part 2 — Bitbucket to Amazon Web Services Pipeline
1. Created Amazon Elastic Container Registry repo named `test-repo`
2. Created Amazon Identity and Access Management user `ist-testing` with Container Registry Power User permission
3. Added Amazon Web Services credentials to Bitbucket as variables
4. Created a `Dockerfile` to package the app
5. Created `bitbucket-pipelines.yml` with 2 steps:
   - Step 1: Prove Amazon Web Services access
   - Step 2: Build Docker image and push to Amazon Elastic Container Registry
6. Fixed multiple pipeline errors (pip, pip3, apt-get, tzdata, Node version)
7. **Pipeline #7 — fully green** — 1 minute 40 seconds
8. Confirmed Docker image appeared in Amazon Elastic Container Registry

### Part 3 — GitHub to Amazon Web Services Pipeline
1. Added same Amazon Web Services credentials to GitHub as secrets
2. Created `.github/workflows/deploy-aws.yml` workflow file
3. Pushed to GitHub — workflow triggered automatically
4. **GitHub Actions #1 — fully green** — 1 minute 4 seconds (first try)
5. Made another code change, pushed again
6. **GitHub Actions #2 — fully green** — 1 minute 4 seconds (auto-triggered)
7. Confirmed 3 Docker images in Amazon Elastic Container Registry:
   - June 3: from Bitbucket pipeline
   - June 4 10:14: from GitHub Actions run #1
   - June 4 10:25: from GitHub Actions run #2

---

## 5. Results and Findings

### Bitbucket Pipeline
```
Status:    Proven working (Pipeline #7)
Speed:     1 min 40 sec
Failures:  7 failed attempts before success
Reason:    Had to manually install AWS CLI and Docker tools
Blocker:   Free plan ran out of 50 minutes — pipeline #10 halted
```

### GitHub Actions
```
Status:    Proven working (Run #1 and #2)
Speed:     1 min 4 sec
Failures:  0 — worked first try
Reason:    AWS CLI and Docker already pre-installed on runner
Limits:    No minute limits on public repos
```

### Winner: GitHub Actions
```
→ Faster
→ No minute limits
→ No manual tool installation needed
→ Cleaner and simpler workflow file
→ Worked on the first try
```

---

## 6. What Was Proved

| Test | Result |
|---|---|
| Bitbucket can connect to Amazon Web Services | ✓ Proved |
| GitHub can connect to Amazon Web Services | ✓ Proved |
| Docker image builds automatically on push | ✓ Proved |
| Docker image reaches Amazon Elastic Container Registry | ✓ Proved |
| Pipeline auto-triggers without manual action | ✓ Proved |
| GitHub Actions is better than Bitbucket Pipelines for this project | ✓ Proved |

---

## 7. What Was NOT Proved (Needs Real Migration to Confirm)

```
→ Deploying to Amazon Elastic Container Service (making app live)
→ Fetching secrets from Amazon SSM Parameter Store
→ Building the Go backend
→ Handling 3 separate environments (dev, staging, production)
→ Using 3 separate Amazon Web Services accounts
```

These will be proven during the actual Blackbox migration.

---

## 8. Important Notes for Client

- This test used **free tier resources only** — minimal to zero cost
- The test Amazon Elastic Container Registry repo (`test-repo`) and test user (`ist-testing`) should be **deleted after migration** to avoid any future charges
- The Blackbox project code was **never touched** during this test
- All findings here are directly applicable to the Blackbox migration
