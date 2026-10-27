# DE Virtual Lab – Setup & Execution Commands
> A single‑file cheat‑sheet you can run in PowerShell or CMD to get the project up‑and‑running, fetch static pages, and launch the Flask server.

---

## 1️⃣ Prerequisites
```powershell
# Verify you have Python 3.10+ installed
python --version

# Verify you have Node.js (>=16) and npm
node --version
npm --version

# (Optional) Git – to clone the repo if you are starting from a remote
git --version
```

## 2️⃣ Clone / Open the Project (skip if you already have the folder)
```powershell
# If the repo is hosted on GitHub, replace <repo-url> with the actual URL
# git clone <repo-url> e:\DE-V
# cd e:\DE-V
```

## 3️⃣ Set Up Python Virtual Environment
```powershell
# Create a virtual environment in the .venv folder
python -m venv .venv

# Activate it (PowerShell)
.\.venv\Scripts\Activate.ps1
# or (CMD)
.\.venv\Scripts\activate.bat
```

## 4️⃣ Install Backend Dependencies
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

## 5️⃣ Install Front‑end Dependencies (Bootstrap, etc.)
```powershell
# The frontend folder already contains a package‑lock; install the packages
cd frontend
npm ci   # installs exact versions from package‑lock.json
cd ..
```

## 6️⃣ Build / Prepare Static Assets
> The current project uses plain HTML/CSS/JS, so a build step is optional. If you later switch to a bundler (Vite/React) run the appropriate command.
```powershell
# Copy the generated logo into the static assets folder (backend/static/img)
mkdir backend\static\img -Force
copy /Y "C:\Users\hshah\.gemini\antigravity\brain\2b8135f9-cc17-4c7f-a44a-1dea973fa0e9\de_virtual_lab_logo_1792992598688.png" backend\static\img\logo.png
```

## 7️⃣ Serve Front‑end Pages via Flask
The Flask app is configured to serve the HTML files from `frontend/` as static templates.
```powershell
# Make sure the virtual env is still active
# Run the development server
python -m flask run --host=0.0.0.0 --port=5000
```
*Open your browser at* `http://localhost:5000` – you should see the **Home** page.

## 8️⃣ Session‑Protected Pages (login required)
The routes `hardware.html` and `qa.html` are protected by the `@login_required` decorator. After you have created a user (see step 9) you can navigate to:
- `http://localhost:5000/hardware`
- `http://localhost:5000/qa`

## 9️⃣ Create an Admin/User for Testing
```powershell
# With the virtual env active, open a Python shell
python
>>> from backend import create_app, db
>>> app = create_app()
>>> ctx = app.app_context(); ctx.push()
>>> from backend.models import User
>>> admin = User(username='admin', email='admin@example.com')
>>> admin.set_password('ChangeMe123!')
>>> db.session.add(admin)
>>> db.session.commit()
>>> exit()
```
Now you can log in with **admin / ChangeMe123!**.

## 🔟 Production Ready (Windows Service / IIS) – Quick Option
```powershell
# Install waitress (a pure‑Python WSGI server) for production
pip install waitress

# Run the app with waitress (listens on port 8080)
waitress-serve --listen=*:8080 backend.app:app
```
You can then expose the service via a reverse proxy (IIS, Nginx on WSL, or Azure App Service).

## 📦 Optional – Docker Build (if you prefer container deployment)
```powershell
# Build the Docker image (Docker Desktop must be installed)
docker build -t devirtuallab:latest .

# Run the container
docker run -d -p 5000:5000 --name devlab devirtuallab:latest
```

---

## 📸 Project Logo
![DE Virtual Lab logo](C:\Users\hshah\.gemini\antigravity\brain\2b8135f9-cc17-4c7f-a44a-1dea973fa0e9\de_virtual_lab_logo_1792992598688.png)

---

### 🎯 Next Steps
1. **Design** – Once you provide colour/typography preferences, we’ll style the pages (CSS variables, dark‑mode, glass‑morphism).  
2. **Routing** – The Flask routes are already wired; you can add more as needed.  
3. **Deployment** – Target date is 6 Dec 2026 – we’ll move to Azure/App Service or a VPS a few weeks before.

---

*All commands are safe to run on Windows PowerShell or CMD. Adjust paths if you place the project elsewhere.*
