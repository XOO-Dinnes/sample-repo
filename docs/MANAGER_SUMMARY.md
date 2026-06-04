# Weekly Update — Blackbox Migration Study
**Date:** June 3–4, 2026

---

## What We Did This Week

Our goal is to move the Blackbox project from Bitbucket to GitHub so deployments to Amazon Web Services happen automatically through GitHub instead.

Before touching the real Blackbox project, we ran a full practice test on a separate test project using free accounts only. The Blackbox project was not touched at any point.

---

## What We Tested

We used a simple test website as a practice project. We connected it to both Bitbucket and GitHub, and made it automatically build and send the app to Amazon Web Services every time code was pushed.

---

## Results

Both platforms worked. Every time we pushed code, the system automatically packaged the app and uploaded it to Amazon Web Services storage without any manual steps.

GitHub Actions was faster (1 minute 4 seconds vs 1 minute 40 seconds on Bitbucket), worked on the first try, and has no monthly time limits. Bitbucket ran out of free minutes during testing.

We confirmed that GitHub Actions is the better choice for this migration.

---

## Proof

Three packaged app versions now exist in Amazon Web Services storage — one from Bitbucket and two from GitHub Actions. This confirms both connections work end to end.

---

## What Is Not Done Yet

We only tested a simplified version. The real Blackbox migration still needs to handle two apps (frontend and backend), three environments (development, staging, and production), and three separate Amazon Web Services accounts.

---

## Next Steps

We have a concrete plan ready. We will copy the Blackbox code to GitHub, set up the automated workflow files for each environment, and test starting from development first before moving to staging and then production. The Bitbucket pipeline stays active as a backup until GitHub is fully confirmed working.

---

## Bottom Line

The practice test is complete and successful. We know the migration is possible, we know what steps to follow, and we are ready to begin the actual Blackbox migration when approved.
