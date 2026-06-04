# Weekly Update — Blackbox Migration Study
**To:** Manager
**From:** Migration Study Team
**Date:** June 3–4, 2026
**Subject:** This Week's Progress — Testing Before Real Migration

---

## What We Are Doing and Why

The Blackbox project currently uses **Bitbucket** to automatically build and deploy to **Amazon Web Services** every time code is pushed. We are studying how to move this process to **GitHub Actions** instead.

Before touching the real Blackbox project, we spent this week doing a **full practice run** on a separate test project to make sure we know what we are doing and that everything works.

**Simple version:**
> We practiced the entire migration process on a safe test project first, so we do not break the real Blackbox system when we do the actual migration.

---

## What We Used for Testing

We used **free accounts only** — no cost to the company:

- A simple test website (not Blackbox) as the practice project
- Free Bitbucket workspace
- Free GitHub account
- Free Amazon Web Services tier

The Blackbox project code was **never touched** during this week.

---

## What We Accomplished This Week

### 1. Git Workflow Practice
We practiced the team development workflow:
- Created 4 separate branches (2 per person)
- Made code changes on each branch
- Submitted Pull Requests for review
- Reviewed and merged all changes into the main branch
- Both team members participated

### 2. Bitbucket to Amazon Web Services — Proved Working
We connected the test project to Amazon Web Services through Bitbucket:
- Every time code was pushed, it automatically built and packaged the app
- The packaged app (Docker image) was successfully uploaded to Amazon Web Services storage (Elastic Container Registry)
- **Result: Confirmed working** — completed in 1 minute 40 seconds

### 3. GitHub Actions to Amazon Web Services — Proved Working
We connected the same test project to Amazon Web Services through GitHub:
- Same automatic process — push code, app builds and uploads automatically
- **Result: Confirmed working on the first try** — completed in 1 minute 4 seconds
- Ran the test twice to confirm it triggers automatically every time

### 4. Compared Both Platforms

| | Bitbucket | GitHub Actions |
|---|---|---|
| Speed | 1 min 40 sec | 1 min 4 sec |
| First try success | No (7 attempts needed) | Yes |
| Monthly limits | 50 minutes — ran out | No limits |
| Setup difficulty | Required manual tool installation | Tools already available |

**Conclusion: GitHub Actions is the better choice for this migration.**

---

## Key Proof Points

All of the following were confirmed and verified:

```
✓ GitHub can automatically connect to Amazon Web Services
✓ Code pushed to GitHub triggers the pipeline automatically
✓ App builds correctly into a Docker image
✓ Docker image successfully reaches Amazon Web Services storage
✓ Process repeats correctly every time code is pushed
✓ Entire process takes about 1 minute with no manual steps
```

Physical proof: 3 Docker images now in Amazon Web Services storage:
- 1 from Bitbucket (June 3)
- 2 from GitHub Actions (June 4)

---

## What We Have NOT Done Yet (Planned for Next Steps)

The test only covered a simplified version. For the real Blackbox migration, these still need to be done:

| Remaining Task | Why Not Done Yet |
|---|---|
| Deploy to Amazon Elastic Container Service (make app live) | Out of scope for test — proved connection only |
| Test with frontend + backend together | Test project was frontend only |
| Test with 3 environments (dev, staging, production) | Test used 1 environment only |
| Fetch secrets from Amazon SSM Parameter Store | Test project has no secrets |
| Actual Blackbox project | Will start after test is confirmed complete |

---

## Migration Plan — Next Steps

We have a concrete plan ready for the actual Blackbox migration:

**Phase 1** — Copy Blackbox code from Bitbucket to GitHub (all branches, all history)

**Phase 2** — Add Amazon Web Services credentials to GitHub (3 sets — one per environment)

**Phase 3** — Create automated workflow files for each environment:
- Development environment (develop branch)
- Staging environment (release branch)
- Production environment (main branch)

**Phase 4** — Test on development environment first
- Confirm frontend builds correctly
- Confirm backend (Go) builds correctly
- Confirm both Docker images reach Amazon Web Services
- Confirm the app still works correctly

**Phase 5** — Test on staging environment

**Phase 6** — Move production (only after staging is fully confirmed)

**Phase 7** — Clean up test resources and disable old Bitbucket pipeline

---

## Important Rules for the Real Migration

1. **Development first, production last** — never touch production before dev and staging are confirmed
2. **Keep Bitbucket running** until GitHub Actions is 100% confirmed working
3. **The app code does not change** — only the pipeline changes
4. **If anything breaks** — rollback immediately by pushing the previous version

---

## Current Status

| Task | Status |
|---|---|
| Practice run on test project | Complete |
| Bitbucket → Amazon Web Services connection proved | Complete |
| GitHub → Amazon Web Services connection proved | Complete |
| Migration plan written and ready | Complete |
| Actual Blackbox migration | Not started — ready to begin |

---

## Bottom Line

This week we proved that the migration is technically possible and that GitHub Actions is the right tool for it. We know exactly what steps to follow, what problems to expect, and how to handle them. We are ready to begin the actual Blackbox migration when approved.
