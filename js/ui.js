/**
 * DE VIRTUAL LAB — UI HELPERS & NOTIFICATION SYSTEM (ui.js)
 */

export const UIEngine = {
  /**
   * Display a floating Toast Notification
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }

    const typeClasses = {
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info: 'bg-primary text-white'
    };

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${typeClasses[type] || typeClasses.info} border-0 show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body font-mono">
          <i class="bi bi-info-circle me-2"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.remove(), 300);
    }, 3000);
  },

  /**
   * Render dynamic global Header/Navbar if empty
   */
  renderNavbar(activePage = 'home') {
    const navbarMount = document.getElementById('navbar-mount');
    if (!navbarMount) return;
    const nav_items = {
        'home':{
            'link':'/',
            'title':'Home',
            'i_class':'bi-house-door'
        },
        'learn':{
            'link':'/learn',
            'title':'Learn',
            'i_class':'bi-book'
        },        
        'simulator':{
            'link':'/simulator',
            'title':'Simulator',
            'i_class':'bi-sliders'
        },
        'truth-table':{
            'link':'/truth-table',
            'title':'Truth Table',
            'i_class':'bi-table'
        },
        'boolean':{
            'link':'/boolean',
            'title':'Boolean',
            'i_class':'bi-calculator'
        },
        'kmap':{
            'link':'/kmap',
            'title':'K-Map',
            'i_class':'bi-grid-3x3'
        },
        'experiments':{
            'link':'/experiments',
            'title':'Experiments',
            'i_class':'bi-journal-check'
        },

        'hardware':{
            'link':'/hardware',
            'title':'Hardware',
            'i_class':'bi-usb-plug'
        },
        'qa':{
            'link':'/qa',
            'title':'Q&A',
            'i_class':'bi-question-circle'
        },
        'progress':{
            'link':'/progress',
            'title':'Progress',
            'i_class':'bi-bar-chart-line'
        }
    }

    let x = `
      <nav class="navbar navbar-expand-lg de-navbar">
        <div class="container-fluid px-lg-4">
          <a class="navbar-brand" href="/">
            <img src="/assets/icons/logo1.png" alt="DE Virtual Lab" height="40" style="object-fit:contain;" class="me-2"/>
          </a>
          <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#deNavbarContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="deNavbarContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-1">`;
      let y=``
      for (let [active, details] of Object.entries(nav_items)){
        y += `<li class="nav-item">
                <a class="nav-link ${activePage === active ? 'active' : ''}" href="${details.link}">
                  <i class="bi ${details.i_class} me-1"></i> ${details.title}
                </a>
              </li>`
      }
      let z =`</ul>
            <!-- Profile avatar dropdown -->
            <div class="dropdown ms-3">
              <button class="btn btn-link p-0" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><a class="dropdown-item" href="/profile"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="/change_password" id="changePasswordLink"><i class="bi bi-key me-2"></i>Change Password</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="/logout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `;
    navbarMount.innerHTML = x+y+z
  },

  /**
   * Render dynamic global Footer if empty
   */
  renderFooter() {
    const footerMount = document.getElementById('footer-mount');
    if (!footerMount) return;

    footerMount.innerHTML = `
      <footer class="de-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-4">
              <h5 class="d-flex align-items-center gap-2">
                <i class="bi bi-cpu-fill text-info"></i> DE Virtual Lab
              </h5>
              <p class="small text-secondary">
                Hardware Input → Digital Circuit Visualization System. Learn logic gates, combinational & sequential circuits visually with hardware synchronization.
              </p>
            </div>
            <div class="col-lg-2 col-6">
              <h5>Navigation</h5>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/learn">Learn Hub</a></li>
                <li><a href="/simulator">Simulator</a></li>
                <li><a href="/experiments">Experiments</a></li>
              </ul>
            </div>
            <div class="col-lg-2 col-6">
              <h5>Tools</h5>
              <ul>
                <li><a href="/truth-table">Truth Table Generator</a></li>
                <li><a href="/boolean">Boolean Solver</a></li>
                <li><a href="/kmap">K-Map Solver</a></li>
                <li><a href="/quiz">Self Assessment</a></li>
              </ul>
            </div>
            <div class="col-lg-4">
              <h5>Course Details</h5>
              <ul class="small">
                <li><strong>Course:</strong> Digital Electronics (DE / DLD)</li>
                <li><strong>Semester:</strong> Syllabus Aligned Virtual Lab</li>
                <li><strong>Technologies:</strong> HTML5, CSS3, ES6 JS, SVG, Web Serial API, Python Streamlit</li>
              </ul>
            </div>
          </div>
          <hr class="my-4 border-secondary opacity-25">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
            <div>&copy; 2026 DE Virtual Lab Team. All rights reserved.</div>
            <div class="mt-2 mt-md-0">Digital Circuit Visualization Engine v1.0.0</div>
          </div>
        </div>
      </footer>
    `;
  }
};
