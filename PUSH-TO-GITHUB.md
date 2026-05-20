# Push this folder to a **new** GitHub repo (backend only)

1. On GitHub: **New repository** → name e.g. `AlumPlus-api` → **empty** (no README).
2. In this folder (`AlumPlus-api`):

```powershell
cd D:\AlumPlus-api
git init
git add .
git commit -m "Initial commit: Alum Plus API"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_BACKEND_REPO.git
git push -u origin main
```

Replace `YOUR_USER/YOUR_BACKEND_REPO` with your repo.

Use a **Personal Access Token** as the password when prompted, or `gh auth login` + `gh auth setup-git` first.
