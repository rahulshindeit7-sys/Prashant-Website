/**
 * routes.js — lightweight routing helpers for static multi-page setup.
 */
(function () {
  'use strict';

  function cleanPath(pathname) {
    var value = String(pathname || '').toLowerCase().replace(/\/$/, '');
    if (!value || value === '') return 'index.html';
    return value;
  }

  function readSlug() {
    // Try query param first (works with ?slug=... format)
    var params = new URLSearchParams(window.location.search || '');
    var slug = (params.get('slug') || '').trim().toLowerCase();
    if (slug) return decodeURIComponent(slug).replace(/[^a-z0-9-]/g, '');

    // Try clean URL: /expertise/{slug}
    var match = window.location.pathname.match(/\/expertise\/([a-z0-9-]+)\/?$/i);
    if (match) return decodeURIComponent(match[1]).toLowerCase().replace(/[^a-z0-9-]/g, '');

    return '';
  }

  function detectPage() {
    var explicit = (document.body && document.body.getAttribute('data-page')) || '';
    if (explicit) return explicit;

    var path = cleanPath(window.location.pathname);
    if (/\/profile(\.html)?$/.test(path)) return 'profile';
    if (/\/expertise(\.html)?$/.test(path)) return 'expertise-list';
    if (/\/expertise-detail(\.html)?$/.test(path)) return 'expertise-detail';
    if (/\/expertise\/[a-z0-9-]+$/.test(path)) return 'expertise-detail';
    if (/\/blog-detail(\.html)?$/.test(path)) return 'blog-detail';
    if (/\/blog(\.html)?$/.test(path)) return 'blog';
    if (/\/contact(\.html)?$/.test(path)) return 'contact';
    if (/\/(index\.html)?$/.test(path)) return 'home';
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
