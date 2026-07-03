/**
 * expertise-detail.js — Expertise detail page loader and renderer
 * Reads slug from URL query parameter and renders appropriate content
 * Falls back gracefully if slug is invalid or missing
 */
(function () {
  'use strict';

  // Helper: HTML escape for safety
  function escHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return (text || '').replace(/[&<>"']/g, function (m) { return map[m]; });
  }

  // Get slug from URL, with default fallback
  function getSlug() {
    var params = new URLSearchParams(window.location.search || '');
    var slug = (params.get('slug') || '').trim().toLowerCase();
    slug = slug ? slug.replace(/[^a-z0-9-]/g, '') : '';
    return slug;  // Return empty string if no slug provided
  }

  // Check if slug was explicitly provided in URL
  function wasSlugProvided() {
    var params = new URLSearchParams(window.location.search || '');
    return params.has('slug');
  }

  // Initialize expertise detail page
  function initExpertiseDetail() {
    var slug = getSlug();
    var DETAILS = window.EXPERTISE_DETAILS || {};
    var expertise = DETAILS[slug];

    // If no slug provided, use default expertise topic
    if (!slug && !wasSlugProvided()) {
      expertise = DETAILS['head-and-neck-cancer'];
      if (expertise) {
        // Render default topic content
        document.title = escHtml(expertise.title) + ' | Dr. Prashant Pawar';
        updateMetaDescription(expertise.subtitle || expertise.overview);
        renderBreadcrumb(expertise.title);
        renderHero(expertise.title, expertise.subtitle);
        renderSection('expertiseOverview', expertise.overview);
        renderKeyPoints(expertise.keyPoints || []);
        renderSections(expertise.sections || []);
        renderWhenToConsult(expertise.whenToConsult || []);
        renderTreatmentOptions(expertise.treatment || []);
        renderFAQs(expertise.faqs || []);
        renderRelatedTopics(expertise.related || []);
        // CTA will be rendered after DOCTOR_CONFIG loads
        renderDisclaimer();
        return;
      }
    }

    // If slug was provided but not found, show error
    if (!expertise) {
      renderNotFound(slug);
      return;
    }

    // Update page title and meta
    document.title = escHtml(expertise.title) + ' | Dr. Prashant Pawar';
    updateMetaDescription(expertise.subtitle || expertise.overview);

    // Render breadcrumb
    renderBreadcrumb(expertise.title);

    // Render hero section
    renderHero(expertise.title, expertise.subtitle);

    // Render overview
    renderSection('expertiseOverview', expertise.overview);

    // Render key points
    renderKeyPoints(expertise.keyPoints || []);

    // Render main sections
    renderSections(expertise.sections || []);

    // Render when to consult
    renderWhenToConsult(expertise.whenToConsult || []);

    // Render treatment options
    renderTreatmentOptions(expertise.treatment || []);

    // Render FAQs
    renderFAQs(expertise.faqs || []);

    // Render related topics
    renderRelatedTopics(expertise.related || []);

    // CTA will be rendered after DOCTOR_CONFIG loads
    // Render disclaimer
    renderDisclaimer();
  }

  function updateMetaDescription(text) {
    var metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    var desc = (text || '').substring(0, 160);
    metaDesc.setAttribute('content', desc);
  }

  function renderBreadcrumb(currentTitle) {
    var container = document.getElementById('breadcrumbCurrent');
    if (container) {
      container.textContent = escHtml(currentTitle);
    }
    var breadcrumbNav = document.getElementById('breadcrumb');
    if (breadcrumbNav) {
      breadcrumbNav.innerHTML = 
        '<a href="index.html">Home</a>' +
        ' <span class="breadcrumb-sep">/</span> ' +
        '<a href="expertise.html">Expertise</a>' +
        ' <span class="breadcrumb-sep">/</span> ' +
        '<span class="breadcrumb-current">' + escHtml(currentTitle) + '</span>' +
        ' <span style="margin-left: 1rem;"><a href="expertise.html" style="font-size: 0.85rem; color: var(--primary);">← Browse All Expertise</a></span>';
    }
  }

  function renderHero(title, subtitle) {
    var titleEl = document.getElementById('expertiseDetailTitle');
    var subtitleEl = document.getElementById('expertiseDetailSubtitle');
    if (titleEl) titleEl.textContent = escHtml(title);
    if (subtitleEl) subtitleEl.textContent = escHtml(subtitle);
  }

  function renderSection(elementId, text) {
    var el = document.getElementById(elementId);
    if (el && text) {
      el.innerHTML = '<p>' + escHtml(text) + '</p>';
    }
  }

  function renderKeyPoints(points) {
    var container = document.getElementById('expertiseKeyPoints');
    if (!container || !Array.isArray(points) || points.length === 0) return;

    var html = '<div class="key-points-grid">';
    points.forEach(function (point) {
      html += '<div class="key-point-card"><p>' + escHtml(point) + '</p></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderSections(sections) {
    var container = document.getElementById('expertiseSections');
    if (!container || !Array.isArray(sections) || sections.length === 0) return;

    var html = '';
    sections.forEach(function (section) {
      if (section && section.heading && section.content) {
        html += '<section class="detail-section">' +
          '<h3>' + escHtml(section.heading) + '</h3>' +
          '<p>' + escHtml(section.content) + '</p>' +
          '</section>';
      }
    });
    container.innerHTML = html;
  }

  function renderWhenToConsult(items) {
    var container = document.getElementById('expertiseWhenToConsult');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    var html = '<div class="consultation-list">';
    items.forEach(function (item) {
      html += '<div class="consultation-item"><span class="icon">✓</span>' + escHtml(item) + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderTreatmentOptions(items) {
    var container = document.getElementById('expertiseTreatment');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    var html = '<div class="treatment-list">';
    items.forEach(function (item) {
      html += '<div class="treatment-item"><span class="bullet">•</span> ' + escHtml(item) + '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderFAQs(faqs) {
    var container = document.getElementById('expertiseFaqs');
    if (!container || !Array.isArray(faqs) || faqs.length === 0) return;

    var html = '<div class="faq-list">';
    faqs.forEach(function (faq, index) {
      if (faq && faq.question && faq.answer) {
        var faqId = 'faq-' + index;
        html += '<div class="faq-item">' +
          '<button class="faq-question" onclick="toggleFAQ(\'' + faqId + '\')">' +
          escHtml(faq.question) +
          '<span class="faq-toggle">+</span>' +
          '</button>' +
          '<div id="' + faqId + '" class="faq-answer" style="display:none;">' +
          '<p>' + escHtml(faq.answer) + '</p>' +
          '</div>' +
          '</div>';
      }
    });
    html += '</div>';
    container.innerHTML = html;

    // Make toggleFAQ available globally
    window.toggleFAQ = function (id) {
      var el = document.getElementById(id);
      if (el) {
        var isHidden = el.style.display === 'none';
        el.style.display = isHidden ? 'block' : 'none';
        var btn = el.previousElementSibling;
        if (btn) {
          var toggle = btn.querySelector('.faq-toggle');
          if (toggle) toggle.textContent = isHidden ? '−' : '+';
        }
      }
    };
  }

  function renderRelatedTopics(related) {
    var container = document.getElementById('expertiseRelated');
    if (!container || !Array.isArray(related) || related.length === 0) return;

    var html = '<div class="related-topics">';
    related.forEach(function (topic) {
      if (topic && topic.slug && topic.title) {
        html += '<a href="expertise-detail.html?slug=' + escHtml(topic.slug) + '" class="related-topic-card">' +
          '<span class="related-topic-title">' + escHtml(topic.title) + '</span>' +
          '<span class="related-topic-arrow">→</span>' +
          '</a>';
      }
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderCTA(topicTitle) {
    var container = document.getElementById('expertiseCTA');
    if (!container) return;

    var html = '<div class="cta-box">' +
      '<h3>Concerned about symptoms?</h3>' +
      '<p>Book a consultation with Dr. Prashant Pawar for personalized evaluation and treatment planning.</p>' +
      '<div class="cta-buttons">' +
      '<a href="index.html#appointment" class="btn btn--primary">Book Appointment</a> ' +
      '<a href="#" id="cta-whatsapp" class="btn btn--whatsapp">WhatsApp</a>' +
      '</div>' +
      '</div>';
    container.innerHTML = html;

    // Set WhatsApp link
    var waBtn = document.getElementById('cta-whatsapp');
    if (waBtn && window.DOCTOR_CONFIG) {
      var clinic = window.DOCTOR_CONFIG.clinic || {};
      var doc = window.DOCTOR_CONFIG.doctor || {};
      var waMessage = 'Hello ' + escHtml(doc.name || 'Doctor') + ', I want consultation regarding ' + escHtml(topicTitle) + '.';
      var waLink = buildWhatsAppUrl(clinic.whatsapp || '', waMessage);
      waBtn.href = waLink;
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
    }
  }

  function buildWhatsAppUrl(phone, message) {
    if (!phone) return '#';
    var clean = String(phone).replace(/\D/g, '');
    if (clean.length < 10) return '#';
    if (!clean.startsWith('91') && clean.length === 10) clean = '91' + clean;
    var encoded = encodeURIComponent(message || '');
    return 'https://wa.me/' + clean + '?text=' + encoded;
  }

  function renderDisclaimer() {
    var container = document.getElementById('expertiseDisclaimer');
    if (container) {
      container.innerHTML = '<p class="disclaimer-text">This information is for educational awareness only and should not replace consultation with a qualified medical doctor. Please consult Dr. Prashant Pawar or another qualified healthcare provider for diagnosis and treatment recommendations.</p>';
    }
  }

  function renderNotFound(slug) {
    document.title = 'Expertise Not Found | Dr. Prashant Pawar';

    var titleEl = document.getElementById('expertiseDetailTitle');
    var subtitleEl = document.getElementById('expertiseDetailSubtitle');
    var contentEl = document.getElementById('expertiseSections');

    if (titleEl) titleEl.textContent = 'Expertise Topic Not Found';
    if (subtitleEl) subtitleEl.textContent = 'The requested expertise topic could not be found.';

    if (contentEl) {
      contentEl.innerHTML = '<div class="not-found-box">' +
        '<p>Sorry, we couldn\'t find the expertise information you\'re looking for.</p>' +
        '<p style="margin-top: 1.5rem;"><a href="expertise.html" class="btn btn--primary">Back to Expertise</a></p>' +
        '</div>';
    }

    // Hide other sections
    var sections = [
      'expertiseOverview',
      'expertiseKeyPoints',
      'expertiseWhenToConsult',
      'expertiseTreatment',
      'expertiseFaqs',
      'expertiseRelated',
      'expertiseCTA'
    ];
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  // Helper: Wait for DOCTOR_CONFIG to be available
  function waitForConfig(callback, maxWaitMs) {
    maxWaitMs = maxWaitMs || 5000;
    var checkInterval = 50;
    var elapsed = 0;
    
    function check() {
      if (window.DOCTOR_CONFIG) {
        callback();
      } else if (elapsed < maxWaitMs) {
        elapsed += checkInterval;
        setTimeout(check, checkInterval);
      } else {
        // Timeout - config not loaded, call callback anyway
        // renderCTA will handle missing config gracefully
        callback();
      }
    }
    
    check();
  }

  // Initialize when DOM is ready
  function initWhenReady() {
    initExpertiseDetail();
    // After initial render, wait for DOCTOR_CONFIG and update CTA
    var ctaTitle = document.querySelector('h1.expertise-hero-title');
    if (ctaTitle) {
      waitForConfig(function() {
        renderCTA(ctaTitle.textContent);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
