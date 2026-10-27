from flask import Flask, send_from_directory, request, redirect, url_for, session, abort
import os

# Path to the folder that contains the HTML pages (frontend)
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

# Directories for static assets
CSS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'css'))
JS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'js'))
ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets'))

app = Flask(__name__, static_folder=FRONTEND_DIR)  # Serve static assets from frontend
app.secret_key = os.urandom(24)  # In production use a fixed secret key

# Simple in‑memory user store for demo purposes
_USERS = {
    "admin": "ChangeMe123!",
}

# Static asset routes (CSS, JS, assets) – placed before generic page route to ensure they are matched first
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(CSS_DIR, filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(JS_DIR, filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(ASSETS_DIR, filename)

def login_required(view_func):
    def wrapper(*args, **kwargs):
        if not session.get('user'):
            return redirect(url_for('login', next=request.path))
        return view_func(*args, **kwargs)
    wrapper.__name__ = view_func.__name__
    return wrapper

@app.route('/')
def home():
    return send_from_directory(FRONTEND_DIR, 'index.html')

# Generic route for static HTML pages in the frontend folder
@app.route('/<page>')
def serve_page(page):
    filename = f"{page}.html"
    allowed = {
        'login', 'signup', 'profile', 'change_password', 'learn', 'simulator', 'truth-table', 'boolean', 'kmap', 'experiments', 'hardware', 'qa', 'progress'
    }
    if page not in allowed:
        abort(404)
    # Protect hardware and qa pages
    if page in {'hardware', 'qa'}:
        if not session.get('user'):
            return redirect(url_for('login', next=request.path))
    return send_from_directory(FRONTEND_DIR, filename)

# Login implementation
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in _USERS and _USERS[username] == password:
            session['user'] = username
            next_page = request.args.get('next') or url_for('home')
            return redirect(next_page)
        else:
            return "Invalid credentials", 401
    return send_from_directory(FRONTEND_DIR, 'login.html')

# Signup implementation
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if not username or not password:
            return "Missing fields", 400
        if username in _USERS:
            return "User already exists", 400
        _USERS[username] = password
        session['user'] = username
        return redirect(url_for('home'))
    return send_from_directory(FRONTEND_DIR, 'signup.html')

# Profile page (requires login)
@app.route('/profile')
@login_required
def profile():
    return send_from_directory(FRONTEND_DIR, 'profile.html')

# Change password (requires login)
@app.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        current = request.form.get('current_password')
        new = request.form.get('new_password')
        user = session['user']
        if _USERS.get(user) != current:
            return "Current password incorrect", 400
        _USERS[user] = new
        return redirect(url_for('profile'))
    return send_from_directory(FRONTEND_DIR, 'change_password.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    # Enable debug mode for development; remove in production
    app.run(host='0.0.0.0', port=5000, debug=True)
