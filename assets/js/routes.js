/**
 * routes.js — lightweight routing helpers for static multi-page setup.
 */
(function () {
  'use strict';

  function cleanPath(pathname) {
    var value = String(pathname || '').toLowerCase();
    if (!value || value === '/') return 'index.html';
    if (value.endsWith('/')) return value.slice(1) + 'index.html';
    return value.split('/').pop();
  }

  function readSlug() {
    var params = new URLSearchParams(window.location.search || '');
    var slug = (params.get('slug') || '').trim().toLowerCase();
    return slug.replace(/[^a-z0-9-]/g, '');
  }

  function detectPage() {
    var explicit = (document.body && document.body.getAttribute('data-page')) || '';
    if (explicit) return explicit;

    var page = cleanPath(window.location.pathname);
    if (page === 'profile.html') return 'profile';
    if (page === 'expertise.html') return 'expertise-list';
    if (page === 'expertise-detail.html') return 'expertise-detail';
    if (page === 'contact.html') return 'contact';
    return 'home';
  }

  function pageUrl(pageKey) {
    if (pageKey === 'home') return 'index.html';
    if (pageKey === 'profile') return 'profile.html';
    if (pageKey === 'expertise-list') return 'expertise.html';
    if (pageKey === 'expertise-detail') return 'expertise-detail.html';
    if (pageKey === 'contact') return 'contact.html';
    return 'index.html';
  }

  window.doctorRoutes = {
    detectPage: detectPage,
    readSlug: readSlug,
    pageUrl: pageUrl
  };
})();
