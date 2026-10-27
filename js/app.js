/**
 * DE VIRTUAL LAB — APP BOOTSTRAPPER (app.js)
 * Global initializations, page detection, header/footer rendering
 */

import { UIEngine } from './ui.js';
import { StorageEngine } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Detect current page
  const path = window.location.pathname;
  let activePage = 'home';

  // When on the login page, use the `next` query param to highlight the target protected page
  if (path === '/login') {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next) {
      const target = next.replace(/^\/+/, ''); // strip leading slash(es)
      if (['hardware', 'qa'].includes(target)) {
        activePage = target;
      }
    }
  } else if (path.includes('learn')) activePage = 'learn';
  else if (path.includes('simulator')) activePage = 'simulator';
  else if (path.includes('truth-table')) activePage = 'truth-table';
  else if (path.includes('boolean')) activePage = 'boolean';
  else if (path.includes('kmap')) activePage = 'kmap';
  else if (path.includes('experiments')) activePage = 'experiments';
  else if (path.includes('hardware')) activePage = 'hardware'
  else if (path.includes('qa')) activePage = 'qa';
  else if (path.includes('progress')) activePage = 'progress';

  // 2. Render Header & Footer
  UIEngine.renderNavbar(activePage);
  UIEngine.renderFooter();

  // 3. Log startup
  console.log(`[DE Virtual Lab] Bootstrapped page: ${activePage}`);
});
