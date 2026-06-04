# Performance Log
Weekly self-assessment based on actual session work. Compiled at end of week.

---

## Session: June 3–4, 2026
**Focus:** Git workflow, Bitbucket setup, CI/CD pipeline, AWS connection, Docker basics

---

## 1. Strengths

### Git & Version Control
- Successfully created 4 branches, made commits, and merged via Pull Requests
- Understood WHY branches need to start from main (not from other branches)
- Understood the difference between push, pull, commit, and merge
- Managed two remotes (GitHub and Bitbucket) on the same project

### Problem Solving
- Persistent through many pipeline failures — kept going instead of giving up
- Asked the right questions when something didn't make sense
- Caught mistakes quickly (e.g. noticed AWS test branch vs main branch issue)

### Conceptual Understanding
- Grasped CI/CD concept quickly once explained with analogies
- Understood Docker image concept (packaged app, not a picture)
- Understood why ECR is storage and ECS is the actual hosting
- Understood the full flow: code → push → pipeline → Docker → AWS

### Collaboration
- Involved coworker in branching practice (real team workflow)
- Understood reviewer vs creator roles in Pull Requests
- Knew when to wait for coworker and when to proceed independently

---

## 2. Weaknesses

### Terminal / Command Line
- Typed API token as SSH key filename by mistake
- Pasted wrong values into wrong fields multiple times (API token into SSH key field)
- Needed reminders on basic syntax (closing quotes, cd commands)
- Confusion between `pip`, `pip3`, and `apt-get` — not yet reading error messages independently

### Authentication & Security Setup
- Took multiple attempts to set up Bitbucket authentication
- Struggled to find the correct settings pages on Bitbucket
- Needed step-by-step guidance for SSH key generation and adding to Bitbucket
- Shared API token in plain text in chat (security risk)

### Reading Error Messages
- Often needed explanation of what errors meant before knowing next step
- Did not yet recognize common errors independently:
  - `command not found` → tool not installed
  - `403 Forbidden` → authentication failed
  - `non-fast-forward` → need to pull before push
  - `user limit exceeded` → billing/plan issue

### File & Project Structure
- Initially confused between `gitfolio/` (the app) and `sample repo/` (the git repo)
- Did not fully understand nested git repos until explained
- Needed clarification on where to place Dockerfile (root vs inside gitfolio)

### Git Internals
- Did not know about gitlinks (nested git repos)
- Needed explanation of why gitfolio files were not showing on GitHub
- Needed guidance on when to force push and when to pull first

---

## 3. What You Need to Improve

### Short Term (This Week)
- [ ] Practice reading terminal error messages — identify what type of error it is before asking
- [ ] Memorize the basic git flow: `checkout main → checkout -b branch → add → commit → push`
- [ ] Practice SSH key setup from scratch (without guidance)
- [ ] Learn the difference between ECR (storage) and ECS (hosting)

### Medium Term (This Month)
- [ ] Get comfortable with terminal commands — especially file paths and flags
- [ ] Understand Docker basics: image, container, Dockerfile, build, push
- [ ] Learn how GitHub Actions works vs Bitbucket pipeline (same concept, different syntax)
- [ ] Practice reading YAML files — both pipeline formats use YAML

### Long Term (For Real Migration)
- [ ] Understand Amazon ECS task definitions (the JSON files in deploy_definitions/)
- [ ] Understand Amazon SSM parameter store (where secrets are fetched from)
- [ ] Understand how 3 environments (dev, staging, production) work with 3 AWS accounts
- [ ] Learn difference between IAM FullAccess, PowerUser, and ReadOnly

---

## 4. What You Lack

| Area | Current Level | Target |
|---|---|---|
| Terminal/CLI comfort | Beginner | Intermediate |
| Reading error messages | Needs guidance | Independent |
| Docker understanding | Basic concept | Can write Dockerfile |
| AWS services | Aware | Understands ECR + ECS + IAM |
| GitHub Actions | Seen it | Can write workflow file |
| Git internals | Basic | Understands remotes, branches, history |
| YAML syntax | Minimal | Can read and modify |
| DevOps concepts | Learning | Understands CI/CD end to end |

---

## 5. What You Did Well This Session (Wins)

```
✓ Pushed project to both GitHub and Bitbucket
✓ Set up SSH key authentication from scratch
✓ Created 4 branches, made changes, opened PRs, merged all into main
✓ Connected Bitbucket to AWS — pipeline proved working (Pipeline #7 green)
✓ Understood what Docker image, ECR, and ECS each do
✓ Read and understood the real blackbox Bitbucket pipeline
✓ Asked deep questions (why, how, what is the purpose) — good learning habit
✓ Kept going through 7+ pipeline failures without giving up
```

---

## 6. Key Moments to Remember

| Moment | Lesson |
|---|---|
| Typed API token as SSH key filename | Always read the prompt before typing |
| Pipeline hung for 39 minutes on tzdata | Interactive prompts break automated pipelines |
| Bitbucket quota ran out at pipeline #10 | Failed test runs consume resources — fix fast |
| Pipeline #7 fully green | Persistence pays off |
| Nested git repo causing gitfolio to not show on GitHub | Git repos inside git repos = gitlinks, not regular files |
| Pasted API token into SSH key field on Bitbucket | Slow down when copy-pasting sensitive values |

---

## End of Week Compile Checklist
- [ ] Add sessions from remaining days of the week
- [ ] Count total wins vs blockers
- [ ] Identify the most repeated mistake (pattern)
- [ ] Pick 1 specific skill to focus on next week
- [ ] Update "Current Level" column based on progress
