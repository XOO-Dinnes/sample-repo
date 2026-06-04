# Project Notes — Sample Repo Test Project

## What This Project Is
A test project using **Gitfolio** (a Next.js portfolio template) to practice:
- Git branching, commits, and merging
- Connecting a repo to Bitbucket and GitHub
- Connecting Bitbucket to AWS with a CI/CD pipeline

---

## Where the Project Lives
| Platform | URL |
|---|---|
| GitHub | https://github.com/XOO-Dinnes/sample-repo |
| Bitbucket | https://bitbucket.org/sampleaws/sample-repo |

---

## What We Did (Session Summary)

### 1. Project Setup
- Scanned the project — a Next.js app inside `gitfolio/` folder
- All content lives in one file: `gitfolio/app/page.tsx`
- Pushed the full project to GitHub

### 2. Pushed to Bitbucket
- Created Bitbucket workspace: `sampleaws`
- Created repo: `sample-repo`
- Set up SSH key for authentication (needed because API tokens had issues)
- Made workspace **public** to allow pushing (private required premium plan)
- Successfully pushed project to Bitbucket

### 3. Branching Practice (4 Branches)
Each branch = 1 small visible change, merged into `main` via Pull Request

| Branch | Change | Who |
|---|---|---|
| `update-nav` | Changed nav title + header color to white | You |
| `update-contact` | Changed button color to blue, text to "GITHUB" | You |
| `update-projects` | Updated project cards | Coworker |
| `update-about` | Updated skills/about section | Coworker |

**Workflow used:**
```
git checkout main
git checkout -b branch-name
# make changes
git add .
git commit -m "message"
git push bitbucket branch-name
# create Pull Request on Bitbucket website
# other person reviews and merges
git checkout main
git pull bitbucket main
```

### 4. Bitbucket → AWS Pipeline Setup

**Goal:** Every push to `main` automatically builds and ships to AWS.

**What was set up:**
- AWS IAM user: `ist-testing`
- AWS ECR repository: `test-repo`
- AWS Account ID: `364046407464`
- AWS Region: `ap-northeast-1`

**Bitbucket variables added:**
| Variable | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | (secured) |
| `AWS_SECRET_ACCESS_KEY` | (secured) |
| `AWS_DEFAULT_REGION` | `ap-northeast-1` |
| `AWS_ACCOUNT_ID` | `364046407464` |

### 5. Dockerfile
Two-stage build:
```
Stage 1 (Builder): Node.js 20 → npm install → npm run build → produces /out folder
Stage 2 (Server):  Nginx → serves the /out files on port 80
```

### 6. Pipeline Script (bitbucket-pipelines.yml)
Two steps run automatically on every push to `main`:
```
Step 1: Prove AWS access
→ Confirm Bitbucket can connect to AWS

Step 2: Build and Push Docker image to ECR
→ Install AWS CLI
→ Login to ECR
→ Build Docker image
→ Push image to AWS ECR
```

---

## Connection Flow — How Everything Works Together

### What Is This Flow?
Every time a developer pushes code, the system automatically takes that code, packages it, and ships it to AWS — no manual steps needed. This is called **CI/CD** (Continuous Integration / Continuous Deployment).

### Why Is It Important?
Without this flow:
```
Developer writes code
→ manually builds it
→ manually logs into AWS
→ manually uploads it
→ hope nothing breaks
```

With this flow:
```
Developer just pushes code
→ everything else happens automatically
→ faster, safer, no human errors
```

### Full Connection Flow (Simple)
```
DEVELOPER
    ↓
writes code locally (page.tsx, Dockerfile, etc.)
    ↓
git push bitbucket main
    ↓
BITBUCKET
    ↓
detects the push → triggers pipeline automatically
    ↓
Step 1: connects to AWS using stored keys (proves access)
    ↓
Step 2: builds Docker image from Dockerfile
    ↓
packages your entire app into one Docker image
    ↓
AWS ECR (storage)
    ↓
stores the Docker image
    ↓
AWS runs the new version → website/app updates live
```

### Test Flow — Why We Test First
```
REAL PROJECT (blackbox)
→ can't make mistakes here, it's live/production

TEST PROJECT (sample-repo) ← what we're doing now
→ safe to break things
→ practice the full flow here first
→ fix all errors here
→ once everything is green → apply to real project
```

### Why Each Part Is Needed

| Part | Why It's Needed |
|---|---|
| **Bitbucket** | Stores the code, triggers the pipeline on push |
| **Pipeline script** | Tells Bitbucket what to do automatically |
| **AWS keys in Bitbucket** | So pipeline can log into AWS on your behalf |
| **Dockerfile** | Tells Docker how to package your app |
| **Docker image** | The packaged app ready for AWS to run |
| **ECR** | AWS storage where Docker images are kept |
| **AWS** | Actually runs your app from the Docker image |

### Simple Real-World Analogy
```
You write a recipe (code)
    ↓
Give it to a factory (Bitbucket pipeline)
    ↓
Factory cooks the meal automatically (Docker build)
    ↓
Puts it in a delivery box (Docker image)
    ↓
Stores in warehouse (ECR)
    ↓
Delivered to customers (AWS runs the app)

You only had to write the recipe — everything else is automatic.
```

---

## Key Concepts Learned

| Concept | Simple Meaning |
|---|---|
| Branch | A separate copy to work on without affecting main |
| Commit | Saving your changes with a message |
| Push | Uploading your commits to Bitbucket/GitHub |
| Pull Request | Asking to merge your branch into main |
| Merge | Combining branch changes into main |
| Pipeline | Automatic tasks that run when you push code |
| Docker image | A packaged snapshot of your app ready to run |
| ECR | AWS storage for Docker images |

---

## Git Remote Setup
This project has two remotes:
```
origin    → GitHub (https://github.com/XOO-Dinnes/sample-repo.git)
bitbucket → Bitbucket (git@bitbucket.org:sampleaws/sample-repo.git)
```

Push to GitHub:   `git push origin main`
Push to Bitbucket: `git push bitbucket main`

---

## Next Goals
- [x] Get pipeline fully green (Bitbucket → build Docker → push to ECR) ← Pipeline #7 done
- [x] Migrate same setup to GitHub → connect GitHub to AWS ← GitHub Actions green
- [ ] Verify new Docker image in AWS ECR after GitHub Actions run
- [ ] Make a code change → push to GitHub → confirm pipeline auto-runs again
- [ ] Apply same workflow to real project (blackbox)

---

## Bitbucket vs GitHub — Simple Comparison

### Pipeline / Automation Tool
| | Bitbucket | GitHub |
|---|---|---|
| Tool name | Bitbucket Pipelines | GitHub Actions |
| Config file | `bitbucket-pipelines.yml` | `.github/workflows/deploy-aws.yml` |
| Where secrets are stored | Repo Settings → Variables | Repo Settings → Secrets and variables → Actions |
| Variable syntax | `$VARIABLE_NAME` | `${{ secrets.VARIABLE_NAME }}` |
| Free minutes per month | 50 minutes only | Unlimited on public repos |
| Speed (our test) | ~1 min 40 sec | ~1 min 4 sec |
| Needs AWS CLI install | Yes — had to install manually | No — already pre-installed |
| Needs Docker install | Yes — had to add as service | No — already pre-installed |

### What Stayed The Same
```
→ Same Docker commands (docker build, docker tag, docker push)
→ Same AWS commands (aws ecr get-login-password, aws sts get-caller-identity)
→ Same ECR repo (test-repo)
→ Same AWS keys and region
→ Same Dockerfile
→ Same concept: push code → auto-build → push to ECR
```

### Key Difference — Minutes Limit
```
Bitbucket free plan:
→ 50 minutes per month total
→ we used all 50 from failed test runs
→ pipeline #10 halted — couldn't continue

GitHub Actions on public repo:
→ NO minute limit
→ pipeline ran in 1 min 4 sec with no issues
→ no quota, no blocking
```

### Key Difference — Pre-installed Tools
```
Bitbucket image:
→ needed to install AWS CLI manually (caused pip, pip3, apt-get errors)
→ needed to add Docker as a separate service
→ caused many failures and wasted minutes

GitHub Actions ubuntu-latest:
→ AWS CLI already installed
→ Docker already installed
→ just write the commands, no setup needed
→ cleaner, faster, fewer errors
```

### Result From Our Test
```
Bitbucket Pipeline #7:  ✓ green — 1 min 40 sec (after 7 failed attempts)
GitHub Actions #1:      ✓ green — 1 min 4 sec  (first try, no failures)
```

---

## GitHub Actions Setup (What We Did)

### Step 1 — Added secrets to GitHub repo
```
github.com/XOO-Dinnes/sample-repo
→ Settings → Secrets and variables → Actions
→ Added:
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_DEFAULT_REGION  (ap-northeast-1)
   AWS_ACCOUNT_ID      (364046407464)
```

### Step 2 — Created workflow file
```
.github/workflows/deploy-aws.yml  ← at ROOT level of repo
```

Two jobs — same as Bitbucket:
```
Job 1: Prove AWS access
→ aws sts get-caller-identity
→ aws ecr describe-repositories

Job 2: Build and Push Docker image
→ login to ECR
→ docker build
→ docker tag
→ docker push
```

### Step 3 — Pushed and watched Actions tab
```
git push origin main
→ GitHub auto-triggered the workflow
→ Actions tab showed green in 1 min 4 sec
→ Both jobs passed on first try
```

---

## How This Connects to Blackbox Migration

```
What we proved with test repo:
✓ GitHub can connect to AWS using secrets
✓ Docker builds and pushes to ECR automatically
✓ Faster and more reliable than Bitbucket
✓ No minute limits

What blackbox migration adds on top:
→ Fetch secrets from Amazon SSM (environment config)
→ Build frontend (yarn build)
→ Build backend (Go/Revel)
→ Two Docker images (frontend + backend)
→ Deploy to Amazon ECS (actually runs the app)
→ 3 separate workflow files (dev, staging, production)
```

---

## Ideas & Notes
- The real project (blackbox) will use the same GitHub Actions → AWS pipeline setup
- Always merge existing branches before creating a refactor branch
- Bitbucket free plan requires workspace to be public for pushing
- Each pipeline run starts fresh — nothing is saved between runs
- GitHub Actions is better choice than Bitbucket for this project — faster, no limits, cleaner
- Blackbox migration order: dev first → staging → production (never touch production first)
