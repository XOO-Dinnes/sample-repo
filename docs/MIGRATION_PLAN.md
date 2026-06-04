# Blackbox Migration Plan
**Goal:** Move the Blackbox project CI/CD pipeline from Bitbucket to GitHub Actions, keeping Amazon Web Services as the deployment target.
**Date Created:** June 4, 2026
**Status:** Draft — subject to change

---

## Overview

The Blackbox project currently uses Bitbucket Pipelines to automatically build and deploy to Amazon Web Services.

We are migrating to GitHub Actions because:
- GitHub Actions has no pipeline minute limits
- AWS CLI and Docker are pre-installed (fewer errors)
- Faster pipeline runs
- GitHub is the destination platform

**The app code stays exactly the same. Only the pipeline changes.**

---

## Project Details (Blackbox)

### Tech Stack
| Tool | Version |
|---|---|
| Node.js | 18.20.8 |
| Yarn | 1.22.22 |
| Go | 1.19.13 |
| Revel (Go framework) | 1.1.0 |
| Docker | 29.1.4 |

### Two Applications
```
Frontend  → Next.js (Node 18) → port 3000
Backend   → Go with Revel framework → port 8080
```

### Three Environments
| Environment | Git Branch | Amazon Web Services Account |
|---|---|---|
| Development | `develop` | 768160678129 |
| Staging | `release` | 814146759171 |
| Production | `main` | 716209213191 |

---

## What the Current Bitbucket Pipeline Does

For each environment, when code is pushed to the branch:

```
Step 1: Get config values from Amazon SSM Parameter Store
        → fetches API URLs and environment variables
        → saves them as .env file

Step 2: Build the frontend
        → yarn install + yarn build

Step 3: Build frontend Docker image → push to ECR

Step 4: Build the backend (Go/Revel package)

Step 5: Build backend Docker image → push to ECR

Step 6: Create new Amazon ECS task definition
        → tells Amazon Web Services what Docker image to use

Step 7: Deploy to Amazon ECS
        → Amazon Web Services swaps old running app with new version
```

---

## Migration Steps

---

### Phase 1 — Preparation (Before Touching Anything)

**1.1 — Create empty private GitHub repository**
```
→ Go to github.com → New repository
→ Name: blackbox (or same as current Bitbucket repo name)
→ Visibility: Private
→ Do NOT add README or .gitignore (keep empty)
```

**1.2 — Mirror Bitbucket repo to GitHub**
```bash
# Clone the Bitbucket repo as a mirror
git clone --mirror git@bitbucket.org:sampleaws/blackbox.git

# Go into the cloned folder
cd blackbox.git

# Push everything to GitHub (all branches, all history)
git push --mirror git@github.com:YOUR_USERNAME/blackbox.git
```

This copies all code, all branches, and all commit history to GitHub.

**1.3 — Verify on GitHub**
```
→ Open github.com/YOUR_USERNAME/blackbox
→ Check all branches exist:
   main, develop, release, feature branches
→ Check commit history looks correct
```

---

### Phase 2 — Add Amazon Web Services Secrets to GitHub

Go to each GitHub repo environment and add the credentials.

**2.1 — Add Development secrets**
```
github.com/YOUR_USERNAME/blackbox
→ Settings → Secrets and variables → Actions
→ New repository secret → add each:

DEV_DEPLOYER_ACCESS_KEY    → (access key for dev AWS account)
DEV_DEPLOYER_SECRET_KEY    → (secret key for dev AWS account)
```

**2.2 — Add Staging secrets**
```
STG_DEPLOYER_ACCESS_KEY    → (access key for staging AWS account)
STG_DEPLOYER_SECRET_KEY    → (secret key for staging AWS account)
```

**2.3 — Add Production secrets**
```
PRO_DEPLOYER_ACCESS_KEY    → (access key for production AWS account)
PRO_DEPLOYER_SECRET_KEY    → (secret key for production AWS account)
```

**2.4 — Add shared secrets**
```
AWS_REGISTRY_URL           → 768160678129.dkr.ecr.ap-northeast-1.amazonaws.com
```

**Why same concept as Bitbucket:**
```
Bitbucket: Repo Settings → Repository Variables → add keys
GitHub:    Repo Settings → Secrets and variables → Actions → add keys
Same idea, different location
```

---

### Phase 3 — Create GitHub Actions Workflow Files

Create 3 separate workflow files — one per environment.

**File locations (at root of repo):**
```
.github/
  workflows/
    deploy-dev.yml      ← runs when pushed to develop branch
    deploy-staging.yml  ← runs when pushed to release branch
    deploy-prod.yml     ← runs when pushed to main branch
```

---

**deploy-dev.yml — Development Environment**

```yaml
name: Deploy to Dev

on:
  push:
    branches:
      - develop

jobs:

  create-env:
    name: Get config from Amazon SSM
    runs-on: ubuntu-latest
    steps:
      - name: Configure Amazon Web Services credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.DEV_DEPLOYER_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.DEV_DEPLOYER_SECRET_KEY }}
          aws-region: ap-northeast-1

      - name: Fetch SSM parameters
        run: |
          echo "NEXT_PUBLIC_API_URL=$(aws ssm get-parameter --name BLACKBOX_NEXT_PUBLIC_API_URL --query Parameter.Value --output text)" > .env.dev
          echo "NEXT_PUBLIC_API_CAREER_UP_URL=$(aws ssm get-parameter --name BLACKBOX_NEXT_PUBLIC_API_CAREER_UP_URL --query Parameter.Value --output text)" >> .env.dev
          echo "NEXT_PUBLIC_WS_HOST=$(aws ssm get-parameter --name BLACKBOX_NEXT_PUBLIC_WS_HOST --query Parameter.Value --output text)" >> .env.dev

      - name: Save .env.dev
        uses: actions/upload-artifact@v4
        with:
          name: env-dev
          path: .env.dev

  build-frontend:
    name: Build Frontend (Node 18 + Yarn)
    runs-on: ubuntu-latest
    needs: create-env
    steps:
      - uses: actions/checkout@v4

      - name: Download .env.dev
        uses: actions/download-artifact@v4
        with:
          name: env-dev

      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install and build
        run: |
          yarn install --production && yarn cache clean
          yarn build:dev

      - name: Save built files
        uses: actions/upload-artifact@v4
        with:
          name: next-build
          path: |
            .next
            node_modules

  docker-frontend:
    name: Build and Push Frontend Docker Image
    runs-on: ubuntu-latest
    needs: build-frontend
    steps:
      - uses: actions/checkout@v4

      - name: Download built frontend
        uses: actions/download-artifact@v4
        with:
          name: next-build

      - name: Configure Amazon Web Services credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.DEV_DEPLOYER_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.DEV_DEPLOYER_SECRET_KEY }}
          aws-region: ap-northeast-1

      - name: Login to Elastic Container Registry
        run: |
          aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_REGISTRY_URL }}

      - name: Build and push frontend image
        run: |
          docker build -t ${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox-front:${{ github.sha }} .
          docker push ${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox-front:${{ github.sha }}

  build-backend:
    name: Build Backend (Go 1.19 + Revel 1.1.0)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Go 1.19
        uses: actions/setup-go@v5
        with:
          go-version: '1.19'

      - name: Install Revel 1.1.0
        run: go install github.com/revel/cmd/revel@v1.1.0

      - name: Package backend
        run: |
          rm -rf blackbox/package
          mkdir blackbox/package
          revel -v package -a blackbox -t package/blackbox.tar.gz -m devserver

      - name: Save backend package
        uses: actions/upload-artifact@v4
        with:
          name: backend-package
          path: blackbox/package/*.tar.gz

  docker-backend:
    name: Build and Push Backend Docker Image
    runs-on: ubuntu-latest
    needs: build-backend
    steps:
      - uses: actions/checkout@v4

      - name: Download backend package
        uses: actions/download-artifact@v4
        with:
          name: backend-package
          path: blackbox/package

      - name: Configure Amazon Web Services credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.DEV_DEPLOYER_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.DEV_DEPLOYER_SECRET_KEY }}
          aws-region: ap-northeast-1

      - name: Login to Elastic Container Registry
        run: |
          aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_REGISTRY_URL }}

      - name: Build and push backend image
        run: |
          cd blackbox
          docker build -t ${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox:${{ github.sha }} .
          docker push ${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox:${{ github.sha }}

  deploy:
    name: Deploy to Amazon ECS
    runs-on: ubuntu-latest
    needs: [docker-frontend, docker-backend]
    steps:
      - uses: actions/checkout@v4

      - name: Configure Amazon Web Services credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.DEV_DEPLOYER_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.DEV_DEPLOYER_SECRET_KEY }}
          aws-region: ap-northeast-1

      - name: Create frontend task definition
        run: |
          export TASK_ROLE_ARN="arn:aws:iam::768160678129:role/dev-BlackBox-Front-TaskRole"
          export CONTAINER_NAME="dev-BlackBox-Front-container"
          export IMAGE_NAME="${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox-front:${{ github.sha }}"
          export LOG_GROUP="/ecs/logs/dev-BlackBox-Front-ecs-group"
          export STREAM_PREFIX="dev-BlackBox-Front"
          export CPU="1024"
          export MEMORY="2048"
          export FAMILY="dev-BlackBox-Front-task"
          envsubst < deploy_definitions/task-definition-frontend-template.json > task-definition-frontend.json

      - name: Create backend task definition
        run: |
          export TASK_ROLE_ARN="arn:aws:iam::768160678129:role/dev-BlackBox-TaskRole"
          export CONTAINER_NAME="dev-BlackBox-container"
          export IMAGE_NAME="${{ secrets.AWS_REGISTRY_URL }}/whitebox/blackbox:${{ github.sha }}"
          export LOG_GROUP="/ecs/logs/dev-BlackBox-ecs-group"
          export STREAM_PREFIX="dev-BlackBox"
          export CPU="512"
          export MEMORY="2048"
          export FAMILY="dev-BlackBox-task"
          envsubst < deploy_definitions/task-definition-backend-template.json > task-definition-backend.json

      - name: Register and deploy to Amazon ECS
        run: |
          aws ecs register-task-definition --cli-input-json file://task-definition-frontend.json
          aws ecs register-task-definition --cli-input-json file://task-definition-backend.json
          aws ecs update-service --cluster dev-cluster --service dev-BlackBox-Front-service --task-definition dev-BlackBox-Front-task
          aws ecs update-service --cluster dev-cluster --service dev-BlackBox-service --task-definition dev-BlackBox-task
```

---

**deploy-staging.yml and deploy-prod.yml**

Same structure as deploy-dev.yml with these differences:

| | Staging | Production |
|---|---|---|
| Branch trigger | `release` | `main` |
| Access key secret | `STG_DEPLOYER_ACCESS_KEY` | `PRO_DEPLOYER_ACCESS_KEY` |
| Secret key secret | `STG_DEPLOYER_SECRET_KEY` | `PRO_DEPLOYER_SECRET_KEY` |
| Amazon Web Services Account | `814146759171` | `716209213191` |
| Cluster name | `stg-cluster` | `pro-cluster` |
| Build command | `yarn build:stg` | `yarn build:pro` |
| Revel mode | `stg` | `prod` |
| Environment prefix | `stg-` | `pro-` |

---

### Phase 4 — Test on Development Environment First

**IMPORTANT: Never test on production first. Always go dev → staging → production.**

```
4.1 → Push a small change to develop branch
4.2 → Watch GitHub Actions run (Actions tab)
4.3 → Check all 5 jobs pass:
      ✓ create-env
      ✓ build-frontend
      ✓ docker-frontend
      ✓ build-backend
      ✓ docker-backend
      ✓ deploy
4.4 → Check dev Amazon Web Services account:
      → ECR has new images
      → ECS service is running new version
4.5 → Open dev environment URL in browser
      → confirm app works correctly
```

---

### Phase 5 — Test Staging

```
5.1 → Merge develop into release branch
5.2 → Watch deploy-staging.yml run
5.3 → Confirm staging environment works
5.4 → Test all features on staging
```

---

### Phase 6 — Production

```
6.1 → Only after staging is confirmed working
6.2 → Merge release into main branch
6.3 → Watch deploy-prod.yml run
6.4 → Monitor production environment closely
6.5 → Confirm app works for real users
```

---

### Phase 7 — Clean Up

```
7.1 → Disable Bitbucket pipelines (don't delete yet — keep as backup)
7.2 → Delete test Amazon Web Services resources:
      → test-repo ECR repository
      → ist-testing IAM user
7.3 → After 2 weeks of stable GitHub Actions → delete old Bitbucket pipeline files
```

---

## Key Rules During Migration

```
1. Always test dev first — never go straight to production
2. Keep Bitbucket pipeline active until GitHub Actions is 100% confirmed
3. Pin exact versions — Node 18, Go 1.19, Revel 1.1.0 (never use "latest")
4. If GitHub Actions fails → rollback by pushing previous commit
5. Never change the app code during migration — only the pipeline
```

---

## Differences: Bitbucket vs GitHub (Quick Reference)

| | Bitbucket | GitHub Actions |
|---|---|---|
| Pipeline file | `bitbucket-pipelines.yml` | `.github/workflows/deploy-*.yml` |
| Variable syntax | `$VARIABLE_NAME` | `${{ secrets.VARIABLE_NAME }}` |
| Commit hash | `$BITBUCKET_COMMIT` | `${{ github.sha }}` |
| Secrets location | Repo Settings → Variables | Repo Settings → Secrets → Actions |
| Artifacts | `artifacts:` | `upload-artifact` + `download-artifact` |
| Job dependency | Steps run in order | `needs: job-name` |

---

## Risks and How to Handle Them

| Risk | Level | How to Handle |
|---|---|---|
| Migration breaks live production | High | Test dev → staging fully before touching production |
| Amazon Web Services credentials exposed | Medium | Use GitHub secrets, never paste in code |
| Wrong Node/Go version breaks build | Medium | Pin exact versions, never use "latest" |
| Revel version mismatch | Medium | Use `@v1.1.0` not `@latest` |
| Pipeline runs on wrong branch | Low | Double check branch names in workflow trigger |

---

## Status Tracker

| Phase | Status |
|---|---|
| Phase 1 — Mirror repo to GitHub | Pending |
| Phase 2 — Add secrets to GitHub | Pending |
| Phase 3 — Create workflow files | Pending |
| Phase 4 — Test development | Pending |
| Phase 5 — Test staging | Pending |
| Phase 6 — Production | Pending |
| Phase 7 — Clean up | Pending |
