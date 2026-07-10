/**
 * app.js — Doctor Website Template Engine
 * Reads ALL content from config/doctor-profile.json
 * No framework. Pure Vanilla JS. Production-ready.
 */
(function () {
  'use strict';

  // Default no-op analytics handler; overwritten when GA is configured.
  window.trackDoctorEvent = window.trackDoctorEvent || function () {};
  var razorpayLoaderPromise = null;

  /* ============================================================
     BOOTSTRAP — fetch config then initialise everything
  ============================================================ */

  // Detect preview mode from ?preview=TOKEN query parameter
  var previewToken = new URLSearchParams(window.location.search).get('preview');
  var previewMode = !!previewToken && previewToken !== '0';

  // Preview link helper - appends preview token to internal page links
  function previewHref(path) {
    if (!previewMode || !previewToken) return path;
    var sep = path.indexOf('?') === -1 ? '?' : '&';
    return path + sep + 'preview=' + encodeURIComponent(previewToken);
  }

  // Rewrite all static HTML links to carry preview token across page navigation
  function rewriteLinksForPreview() {
    if (!previewMode || !previewToken) return;
    var internalPages = ['index.html', 'expertise.html', 'expertise-detail.html', 'profile.html', 'contact.html'];
    document.querySelectorAll('a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) return;
      // Check if it's an internal page link
      var isInternal = internalPages.some(function(page) { return href === page || href.indexOf(page + '?') === 0 || href.indexOf(page + '#') === 0 || href === './' + page; });
      // Also catch ./#anchor links (homepage anchors)
      if (href.indexOf('./#') === 0 || href === './') isInternal = true;
      if (!isInternal) return;
      // Don't double-add token
      if (href.indexOf('preview=') !== -1) return;
      var sep = href.indexOf('?') === -1 ? '?' : '&';
      a.setAttribute('href', href + sep + 'preview=' + encodeURIComponent(previewToken));
    });
  }


  
  var configPromise;
  if (previewMode) {
    // Preview mode: fetch draft config using preview token
    configPromise = fetch('/api/preview/config?token=' + encodeURIComponent(previewToken), {
      method: 'GET'
    });
  } else {
    // Live mode: fetch static config
    configPromise = fetch('./config/doctor-profile.json?v=' + Date.now());
  }

  configPromise
    .then(function (res) {
      if (!res.ok) {
        if (previewMode && res.status === 401) {
          console.warn('[DoctorSite] Preview token expired, showing live config in preview mode');
          return fetch('./config/doctor-profile.json?v=' + Date.now());
        }
        throw new Error('HTTP ' + res.status + ': config not found.');
      }
      return res.json();
    })
    .then(function (response) {
      // Extract config from API response or use directly if static file
      var config = response.config || response;
      window.DOCTOR_CONFIG = config;
      window.PREVIEW_MODE = previewMode;
      window.PREVIEW_TOKEN = previewToken;
      init(config);
    })
    .catch(function (err) {
      console.error('[DoctorSite] Config load error:', err.message);
      renderFatalConfigError(err.message || 'Unknown config loading error.');
    });

  function renderFatalConfigError(message) {
    var wrapper = document.createElement('div');
    wrapper.style.fontFamily = 'sans-serif';
    wrapper.style.textAlign = 'center';
    wrapper.style.padding = '4rem 2rem';
    wrapper.style.color = '#c0392b';

    var title = document.createElement('h1');
    title.style.marginBottom = '1rem';
    title.textContent = 'Configuration Error';

    var p1 = document.createElement('p');
    p1.textContent = 'config/doctor-profile.json could not be loaded.';

    var p2 = document.createElement('p');
    p2.style.marginTop = '.5rem';
    p2.style.fontSize = '.9rem';
    p2.textContent = 'Make sure the file exists and the site is served over HTTP/HTTPS (not file://).';

    var p3 = document.createElement('p');
    p3.style.marginTop = '1rem';
    p3.style.fontSize = '.8rem';
    p3.style.color = '#7f8c8d';
    p3.textContent = message;

    wrapper.appendChild(title);
    wrapper.appendChild(p1);
    wrapper.appendChild(p2);
    wrapper.appendChild(p3);

    document.body.innerHTML = '';
    document.body.appendChild(wrapper);
  }

  /**
   * Inject preview mode banner at top of page
   * Shows "Preview Mode — Not Published" in a fixed position
   */
  function injectPreviewBanner() {
    var banner = document.createElement('div');
    banner.id = 'preview-mode-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = '#ffd700';
    banner.style.color = '#333';
    banner.style.padding = '12px 20px';
    banner.style.textAlign = 'center';
    banner.style.fontSize = '14px';
    banner.style.fontWeight = 'bold';
    banner.style.zIndex = '10000';
    banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    banner.textContent = '⚠️ Preview Mode — Not Published';
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Add top margin to body to account for banner
    if (!document.body.style.marginTop || document.body.style.marginTop === '') {
      document.body.style.marginTop = '48px';
    }
  }

  /* ============================================================
     MAIN INIT
  ============================================================ */
  function init(C) {
    // Inject preview mode banner if in preview mode
    if (window.PREVIEW_MODE) {
      injectPreviewBanner();
    }

    // Preview mode: intercept internal links to carry preview token
    if (window.PREVIEW_TOKEN) {
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (href.indexOf('preview=') !== -1) return; // already has token
        e.preventDefault();
        var sep = href.indexOf('?') !== -1 ? '&' : '?';
        window.location.href = href + sep + 'preview=' + encodeURIComponent(window.PREVIEW_TOKEN);
      });
    }


    var ctx = getPageContext();
    initSEO(C, ctx);
    initExclusionGuards(C);

    if (ctx.page === 'home') {
      initNavbar(C);
      initHero(C);
      initAbout(C);
      initServices(C);
      initExpertise(C);
      initCounters(C);
      initAppointmentForm(C);
      initTestimonials(C);
      initFeedbackForm(C);
      initCaseArchive(C);
      initFAQ(C);
      initContact(C);
      initFooter(C);
      initWhatsAppFloat(C);
      initCallFloat(C);
      initEngagementTracking(C);
    } else {
      initSharedPageShell(C, ctx);
      initRoutePageContent(C, ctx);
      initWhatsAppFloat(C);
      initCallFloat(C);
      initEngagementTracking(C);
    }

    initScrollRevealEffects();
    initLazyImages();
    scrollToCurrentHashTarget();
    rewriteLinksForPreview();
  }

  function scrollToCurrentHashTarget() {
    if (!window.location.hash) return;

    window.setTimeout(function () {
      var id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      var navbar = document.querySelector('.navbar');
      var offset = navbar ? navbar.getBoundingClientRect().height + 24 : 24;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 150);
  }

  function getPageContext() {
    var routes = window.doctorRoutes || {};
    var page = typeof routes.detectPage === 'function' ? routes.detectPage() : 'home';
    var slug = typeof routes.readSlug === 'function' ? routes.readSlug() : '';
    if (!slug && page === 'expertise-detail') {
      try {
        slug = sessionStorage.getItem('selectedExpertiseSlug') || '';
      } catch (err) {
        slug = '';
      }
    }
    return { page: page || 'home', slug: slug || '' };
  }

  function initSharedPageShell(C, ctx) {
    var header = document.getElementById('shared-header');
    var footer = document.getElementById('shared-footer');
    var clinic = C.clinic || {};
    var doc = C.doctor || {};
    var pages = C.pages || {};
    var excluded = getExcludedRouteSet(C);

    var navItems = [];
    var homeAnchors = pages.home && Array.isArray(pages.home.anchors)
      ? pages.home.anchors
      : [
          { id: 'about', label: 'About' },
          { id: 'services', label: 'Services' },
          { id: 'why-us', label: 'Why Us' },
          { id: 'testimonials', label: 'Testimonials' },
          { id: 'faq', label: 'FAQ' },
          { id: 'contact', label: 'Contact' }
        ];

    homeAnchors.forEach(function (anchor) {
      if (!anchor || !anchor.id || !anchor.label) return;
      if (anchor.id === 'contact' && pages.contact && pages.contact.enabled) return;
      navItems.push('<a href="' + previewHref('./' ) + '#' + escHtml(anchor.id) + '">' + escHtml(anchor.label) + '</a>');
    });

    if (pages.profile && pages.profile.enabled && !excluded.profile) {
      navItems.push('<a href="' + escHtml(previewHref(pages.profile.path || 'profile.html')) + '">' + escHtml(pages.profile.nav_label || 'Profile') + '</a>');
    }
    if (pages.expertise && pages.expertise.enabled && !excluded.expertise) {
      navItems.push('<a href="' + escHtml(previewHref(pages.expertise.path || 'expertise.html')) + '">' + escHtml(pages.expertise.nav_label || 'Expertise') + '</a>');
    }
    if (pages.blog && pages.blog.enabled) {
      navItems.push('<a href="' + escHtml(previewHref(pages.blog.path || 'blog.html')) + '">' + escHtml(pages.blog.nav_label || 'Blog') + '</a>');
    }
    if (pages.contact && pages.contact.enabled && !excluded.contact) {
      navItems.push('<a href="' + escHtml(previewHref(pages.contact.path || 'contact.html')) + '">' + escHtml(pages.contact.nav_label || 'Contact') + '</a>');
    }

    if (header) {
      header.innerHTML =
        '<nav class="navbar" role="navigation" aria-label="Main Navigation">' +
          '<div class="container navbar__inner">' +
            '<a href="' + previewHref('index.html') + '" class="navbar__logo" aria-label="Home">' +
              '<span class="navbar__logo-orbit">' +
                '<img src="assets/images/Dr Prashant Logo.png" alt="' + escHtml(doc.name || clinic.name || 'Doctor Website') + ' logo" class="navbar__logo-mark" loading="eager" />' +
              '</span>' +
              '<span class="navbar__logo-caption" aria-hidden="true">' +
                '<span>Oral &amp; Maxillofacial Surgeon</span>' +
                '<span>Head &amp; Neck Surgical Care</span>' +
                '<span>Expertise <b>&middot;</b> Precision <b>&middot;</b> Compassion</span>' +
              '</span>' +
            '</a>' +
            '<div class="route-nav-links">' + navItems.join('') + '</div>' +
          '</div>' +
        '</nav>';
    }

    if (footer) {
      footer.innerHTML =
        '<footer class="footer">' +
          '<div class="container footer__bottom">' +
            '<p>© ' + new Date().getFullYear() + ' ' + escHtml(clinic.name || doc.name || 'Doctor Website') + '. All rights reserved.</p>' +
          '</div>' +
        '</footer>';
    }
  }

  function initRoutePageContent(C, ctx) {
    var doc = C.doctor || {};
    var clinic = C.clinic || {};
    var expertise = getExpertiseRouteItems(C);

    if (ctx.page === 'profile') {
      setTextById('profile-heading', doc.name || 'Doctor Profile');
      setTextById('profile-summary', (doc.degree || '') + (doc.specialization ? ' · ' + doc.specialization : ''));
      setImgById('profile-photo', doc.photo_about || doc.photo || doc.photo_logo || '', doc.name || 'Doctor profile photo');

      var profileContent = document.getElementById('profile-content');
      if (profileContent) {
        var aboutParas = String(doc.about || 'Profile details will be loaded from config.')
          .split('\n')
          .filter(function (line) { return line.trim(); })
          .map(function (line) { return '<p>' + escHtml(line) + '</p>'; })
          .join('');
        profileContent.innerHTML = aboutParas;
      }

      var profileCreds = document.getElementById('profile-credentials');
      if (profileCreds) {
        var chips = [];
        if (doc.registration_number && doc.registration_number.indexOf('ADD_') === -1) {
          chips.push('Registration: ' + doc.registration_number);
        }
        if (Array.isArray(doc.certifications)) {
          chips = chips.concat(doc.certifications.filter(Boolean));
        }
        if (Array.isArray(doc.awards)) {
          chips = chips.concat(doc.awards.filter(Boolean));
        }
        if (Array.isArray(doc.languages) && doc.languages.length) {
          chips.push('Languages: ' + doc.languages.join(', '));
        }

        profileCreds.innerHTML = chips.map(function (entry) {
          return '<span class="about__chip">' + escHtml(entry) + '</span>';
        }).join('');
      }
      return;
    }

    if (ctx.page === 'expertise-list') {
      var expertiseSection = C.expertise_section || {};
      setTextById('expertise-heading', expertiseSection.title || 'Expertise');
      setTextById('expertise-summary', expertiseSection.subtitle || 'Explore available treatment and surgical expertise areas.');

      var expertiseHero = document.getElementById('expertise-hero-image');
      if (expertiseHero) {
        var firstImage = expertise.length && expertise[0].hero_image ? expertise[0].hero_image : '';
        if (firstImage) {
          setImgById('expertise-hero-image', firstImage, 'Expertise highlight image');
          var heroWrap = document.querySelector('.expertise-hero-wrap');
          if (heroWrap) heroWrap.style.display = 'block';
        } else {
          var heroWrap = document.querySelector('.expertise-hero-wrap');
          if (heroWrap) heroWrap.style.display = 'none';
        }
      }

      var list = document.getElementById('expertise-list');
      if (list) {
        list.innerHTML = expertise.map(function (item) {
          var slug = (item.slug || slugify(item.title || '')).toLowerCase();
          return (
            '<article class="service-card">' +
              '<h2 class="service-card__name">' + escHtml(item.title || '') + '</h2>' +
              '<p class="service-card__desc">' + escHtml(item.summary || '') + '</p>' +
              '<a class="btn btn--primary" data-expertise-slug="' + escHtml(slug) + '" href="expertise-detail.html?slug=' + encodeURIComponent(slug) + (window.PREVIEW_TOKEN ? '&preview=' + encodeURIComponent(window.PREVIEW_TOKEN) : '') + '">Read More</a>' +
            '</article>'
          );
        }).join('');

        list.addEventListener('click', function (event) {
          var link = event.target && event.target.closest ? event.target.closest('[data-expertise-slug]') : null;
          if (!link) return;

          try {
            sessionStorage.setItem('selectedExpertiseSlug', link.getAttribute('data-expertise-slug') || '');
          } catch (err) {
            // Continue normal navigation if storage is unavailable.
          }
        });
      }
      return;
    }

    if (ctx.page === 'expertise-detail') {
      var detail = expertise.find(function (item) {
        return (item.slug || '').toLowerCase() === (ctx.slug || '').toLowerCase();
      });

      function renderDetailSection(id, contentHtml) {
        var el = document.getElementById(id);
        if (!el) return;
        if (contentHtml) {
          el.innerHTML = contentHtml;
          el.style.display = '';
        } else {
          el.innerHTML = '';
          el.style.display = 'none';
        }
      }

      if (!detail) {
        setTextById('expertiseDetailTitle', 'Expertise Detail Not Found');
        setTextById('expertiseDetailSubtitle', 'No content found for this topic.');
        setTextById('breadcrumbCurrent', 'Not Found');
        renderDetailSection('expertiseOverview', '<p>Please return to the expertise listing and choose a valid topic.</p>');
        ['expertiseKeyPoints', 'expertiseSections', 'expertiseWhenToConsult', 'expertiseTreatment', 'expertiseFaqs', 'expertiseRelated'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        return;
      }

      setTextById('expertiseDetailTitle', detail.title || '');
      setTextById('expertiseDetailSubtitle', detail.summary || '');
      setTextById('breadcrumbCurrent', detail.title || '');

      // Overview — fall back to first content block body if overview field is absent
      var overviewText = detail.overview
        || (Array.isArray(detail.content_blocks) && detail.content_blocks[0] && detail.content_blocks[0].body)
        || '';
      renderDetailSection('expertiseOverview', overviewText
        ? '<h2>Overview</h2><p>' + escHtml(overviewText) + '</p>'
        : '');

      // Key Points
      var keyPoints = Array.isArray(detail.keyPoints) ? detail.keyPoints : [];
      renderDetailSection('expertiseKeyPoints', keyPoints.length
        ? '<h2>Key Points</h2><div class="key-points-grid">' + keyPoints.map(function (p) {
            return '<div class="key-point-card"><p>' + escHtml(p) + '</p></div>';
          }).join('') + '</div>'
        : '');

      // When to Consult
      var whenToConsult = Array.isArray(detail.whenToConsult) ? detail.whenToConsult : [];
      renderDetailSection('expertiseWhenToConsult', whenToConsult.length
        ? '<h2>When to Consult a Specialist</h2><div class="consultation-list">' + whenToConsult.map(function (i) {
            return '<div class="consultation-item"><span class="icon">\u2713</span>' + escHtml(i) + '</div>';
          }).join('') + '</div>'
        : '');

      // Treatment & Management Options
      var treatment = Array.isArray(detail.treatment) ? detail.treatment : [];
      renderDetailSection('expertiseTreatment', treatment.length
        ? '<h2>Treatment &amp; Management Options</h2><div class="treatment-list">' + treatment.map(function (i) {
            return '<div class="treatment-item"><span class="bullet">\u2022</span> ' + escHtml(i) + '</div>';
          }).join('') + '</div>'
        : '');

      // FAQs
      var faqs = Array.isArray(detail.faqs) ? detail.faqs : [];
      renderDetailSection('expertiseFaqs', faqs.length
        ? '<h2>Frequently Asked Questions</h2><div class="faq-list">' + faqs.map(function (f) {
            return '<div class="faq-item"><h3 class="faq-question">' + escHtml(f.question || '') + '</h3><p class="faq-answer">' + escHtml(f.answer || '') + '</p></div>';
          }).join('') + '</div>'
        : '');

      // Hide sections we don't populate via CMS
      ['expertiseSections', 'expertiseRelated'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      return;
    }

    if (ctx.page === 'contact') {
      var contactContent = document.getElementById('contact-content');
      if (contactContent) {
        contactContent.innerHTML =
          '<p><strong>Address:</strong> ' + escHtml((clinic.address || '') + ', ' + (clinic.city || '')) + '</p>' +
          '<p><strong>Phone:</strong> ' + escHtml(clinic.phone || '') + '</p>' +
          '<p><strong>Email:</strong> ' + escHtml(clinic.email || '') + '</p>';
      }

      var routeTiming = document.getElementById('contact-route-timing');
      var timing = clinic.timing || {};
      if (routeTiming) {
        var showTimingRaw = clinic.show_timing;
        var showTiming = !(showTimingRaw === false || showTimingRaw === 0 ||
          (typeof showTimingRaw === 'string' && /^(false|off|no|0)$/i.test(showTimingRaw.trim())));
        if (!showTiming) {
          routeTiming.innerHTML = '';
        } else {
          routeTiming.innerHTML =
            '<p><strong>Mon - Fri:</strong> ' + escHtml(timing.weekdays || '') + '</p>' +
            '<p><strong>Saturday:</strong> ' + escHtml(timing.saturday || '') + '</p>' +
            '<p><strong>Sunday:</strong> ' + escHtml(timing.sunday || 'Closed') + '</p>';
        }
      }

      var routeMap = document.getElementById('contact-route-map');
      if (routeMap) {
        var mapUrl = getEmbeddableMapUrl(clinic);
        if (mapUrl) {
          routeMap.innerHTML = '';
          var iframe = document.createElement('iframe');
          iframe.src = mapUrl;
          iframe.loading = 'lazy';
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          iframe.title = (clinic.name || 'Clinic') + ' Location';
          routeMap.appendChild(iframe);
        } else {
          routeMap.innerHTML = '<div class="contact__map--placeholder"><span style="font-size:2rem">📍</span><span>Add location config to display map</span></div>';
        }
      }
    }

    if (ctx.page === 'blog') {
      var blogContainer = document.getElementById('blog-list');
      if (blogContainer) {
        var posts = Array.isArray(C.blog_posts) ? C.blog_posts.filter(function (p) { return p.published !== false; }) : [];
        if (posts.length === 0) {
          blogContainer.innerHTML = '<p class="blog-empty">No blog posts yet. Check back soon!</p>';
        } else {
          posts.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
          var html = '';
          posts.forEach(function (post) {
            var imgHtml = post.image
              ? '<img src="' + escHtml(post.image) + '" alt="' + escHtml(post.title || '') + '" class="blog-card__image" loading="lazy" />'
              : '<div class="blog-card__image blog-card__image--placeholder">\ud83d\udcdd</div>';
            var dateStr = post.date ? formatDate(post.date) : '';
            var tagsHtml = '';
            if (Array.isArray(post.tags) && post.tags.length) {
              tagsHtml = '<div class="blog-card__tags">' + post.tags.map(function (t) {
                return '<span class="blog-card__tag">' + escHtml(t) + '</span>';
              }).join('') + '</div>';
            }
            html += '<a href="' + previewHref('blog-detail.html?slug=' + encodeURIComponent(post.slug || '')) + '" class="blog-card">' +
              imgHtml +
              '<div class="blog-card__body">' +
                '<h3 class="blog-card__title">' + escHtml(post.title || 'Untitled') + '</h3>' +
                (dateStr ? '<p class="blog-card__date">' + escHtml(dateStr) + '</p>' : '') +
                '<p class="blog-card__summary">' + escHtml(post.summary || '') + '</p>' +
                tagsHtml +
              '</div></a>';
          });
          blogContainer.innerHTML = html;
        }
      }
    }

    if (ctx.page === 'blog-detail') {
      var detailContainer = document.getElementById('blog-detail-content');
      if (detailContainer) {
        var slug = new URLSearchParams(window.location.search).get('slug') || '';
        var allPosts = Array.isArray(C.blog_posts) ? C.blog_posts : [];
        var post = null;
        for (var i = 0; i < allPosts.length; i++) {
          if (allPosts[i].slug === slug) { post = allPosts[i]; break; }
        }
        if (!post) {
          detailContainer.innerHTML = '<h1>Post Not Found</h1><p>The blog post you are looking for does not exist.</p>';
        } else {
          var dateStr = post.date ? formatDate(post.date) : '';
          var tagsHtml = '';
          if (Array.isArray(post.tags) && post.tags.length) {
            tagsHtml = '<div class="blog-detail__tags">' + post.tags.map(function (t) {
              return '<span class="blog-card__tag">' + escHtml(t) + '</span>';
            }).join('') + '</div>';
          }
          var imgHtml = post.image ? '<img src="' + escHtml(post.image) + '" alt="' + escHtml(post.title || '') + '" class="blog-detail__image" loading="lazy" />' : '';
          var contentHtml = '';
          if (post.content) {
            if (/<[a-z][\\s\\S]*>/i.test(post.content)) {
              contentHtml = post.content;
            } else {
              contentHtml = post.content.split(/\\n\\n+/).map(function (para) {
                return '<p>' + escHtml(para.trim()) + '</p>';
              }).join('');
            }
          }
          detailContainer.innerHTML =
            '<h1 id="blog-detail-heading">' + escHtml(post.title || '') + '</h1>' +
            (post.author || dateStr ? '<p class="blog-detail__meta">' +
              (post.author ? '<span class="blog-detail__author">By ' + escHtml(post.author) + '</span>' : '') +
              (dateStr ? '<span class="blog-detail__date">' + escHtml(dateStr) + '</span>' : '') +
            '</p>' : '') +
            imgHtml + tagsHtml +
            '<div class="blog-detail__body">' + contentHtml + '</div>';
          if (post.title) document.title = post.title + ' | ' + (C.doctor && C.doctor.name ? C.doctor.name : 'Blog');
        }
      }
    }
  }

  /* ============================================================
     1. SEO — meta tags + Schema.org JSON-LD
  ============================================================ */
  function initSEO(C, ctx) {
    var seo    = C.seo    || {};
    var clinic = C.clinic || {};
    var doc    = C.doctor || {};
    var siteId = C.site_id || '';
    var pageSeo = resolvePageSeo(C, ctx || { page: 'home', slug: '' });

    // Title & basic meta
    document.title = pageSeo.title || seo.meta_title || clinic.name || 'Doctor Website';
    setMetaName('description', pageSeo.description || seo.meta_description || '');
    var combinedKeywords = [];
    if (Array.isArray(seo.keywords)) {
      combinedKeywords = combinedKeywords.concat(seo.keywords);
    }
    if (Array.isArray(seo.local_keywords)) {
      combinedKeywords = combinedKeywords.concat(seo.local_keywords);
    }
    var uniqueKeywords = Array.from(new Set(combinedKeywords.filter(Boolean).map(function (k) {
      return String(k).trim();
    })));
    setMetaName('keywords', uniqueKeywords.join(', '));
    setMetaName('robots', 'index, follow');

    // Canonical
    var canonicalUrl = pageSeo.canonical || ((clinic.website && /^https?:\/\//i.test(clinic.website))
      ? clinic.website
      : window.location.href);
    setAttrById('canonical-url', 'href', canonicalUrl);

    // Open Graph
    setMetaProp('og:title',       pageSeo.title || seo.meta_title       || '');
    setMetaProp('og:description', pageSeo.description || seo.meta_description || '');
    setMetaProp('og:image',       absoluteUrl(seo.og_image || ''));
    setMetaProp('og:url',         window.location.href);

    // Twitter Card
    setMetaName('twitter:title',       pageSeo.title || seo.meta_title       || '');
    setMetaName('twitter:description', pageSeo.description || seo.meta_description || '');
    setMetaName('twitter:image',       absoluteUrl(seo.og_image || ''));

    // Schema.org — MedicalBusiness / Dentist
    var schemaOrg = {
      '@context': 'https://schema.org',
      '@type': seo.schema_type || 'Dentist',
      'identifier': siteId,
      'name':        clinic.name,
      'description': doc.specialization || '',
      'url':         clinic.website || window.location.origin,
      'telephone':   clinic.phone  || '',
      'email':       clinic.email  || '',
      'image':       absoluteUrl(doc.photo || ''),
      'address': {
        '@type':           'PostalAddress',
        'streetAddress':   clinic.address || '',
        'addressLocality': clinic.city    || '',
        'postalCode':      clinic.pincode || '',
        'addressCountry':  'IN'
      },
      'openingHoursSpecification': buildOpeningHours(clinic.timing || {}),
      'priceRange': '₹₹',
      'medicalSpecialty': 'Oral Surgery',
      'aggregateRating': {
        '@type':       'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': String(Array.isArray(C.testimonials) ? C.testimonials.length * 25 : 150)
      }
    };

    if (clinic.geo && typeof clinic.geo.latitude !== 'undefined' && typeof clinic.geo.longitude !== 'undefined') {
      schemaOrg.geo = {
        '@type': 'GeoCoordinates',
        'latitude': clinic.geo.latitude,
        'longitude': clinic.geo.longitude
      };
    }
    if (Array.isArray(clinic.area_served) && clinic.area_served.length > 0) {
      schemaOrg.areaServed = clinic.area_served.filter(Boolean);
    }

    // FAQ Schema
    var faqSchema = null;
    if (Array.isArray(C.faqs) && C.faqs.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': C.faqs.map(function (f) {
          return {
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': f.answer }
          };
        })
      };
    }

    var schemaScript = document.getElementById('schema-jsonld');
    if (schemaScript) {
      schemaScript.textContent = JSON.stringify(
        faqSchema ? [schemaOrg, faqSchema] : schemaOrg
      );
    }

    // Google Analytics (if configured)
    var gaId = seo.google_analytics_id;
    if (gaId && gaId !== 'G-XXXXXXXXXX') {
      var gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
      document.head.appendChild(gaScript);
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId);
      window.trackDoctorEvent = function (eventName, params) {
        if (window.gtag) {
          window.gtag('event', eventName, params || {});
        }
      };
    }
  }

  function resolvePageSeo(C, ctx) {
    var seo = C.seo || {};
    var pageMap = seo.pages || {};
    var origin = window.location.origin;
    var result = {
      title: seo.meta_title || '',
      description: seo.meta_description || '',
      canonical: window.location.href
    };

    function toAbsolute(path) {
      if (!path) return '';
      if (/^https?:\/\//i.test(path)) return path;
      return origin + '/' + String(path).replace(/^\//, '');
    }

    if (ctx.page === 'profile' && pageMap.profile) {
      result.title = pageMap.profile.meta_title || result.title;
      result.description = pageMap.profile.meta_description || result.description;
      result.canonical = toAbsolute(pageMap.profile.canonical) || result.canonical;
    } else if (ctx.page === 'expertise-list' && pageMap.expertise) {
      result.title = pageMap.expertise.meta_title || result.title;
      result.description = pageMap.expertise.meta_description || result.description;
      result.canonical = toAbsolute(pageMap.expertise.canonical) || result.canonical;
    } else if (ctx.page === 'contact' && pageMap.contact) {
      result.title = pageMap.contact.meta_title || result.title;
      result.description = pageMap.contact.meta_description || result.description;
      result.canonical = toAbsolute(pageMap.contact.canonical) || result.canonical;
    } else if (ctx.page === 'expertise-detail' && pageMap.expertise_detail) {
      var detailItem = getExpertiseRouteItems(C).find(function (item) {
        return (item.slug || '').toLowerCase() === (ctx.slug || '').toLowerCase();
      });
      var titleTemplate = pageMap.expertise_detail.meta_title_template || '{title}';
      var descTemplate = pageMap.expertise_detail.meta_description_template || '{summary}';
      var canonicalTemplate = pageMap.expertise_detail.canonical_template || '/expertise/{slug}';
      if (detailItem) {
        result.title = titleTemplate
          .replace('{title}', detailItem.title || '')
          .replace('{slug}', detailItem.slug || '');
        result.description = descTemplate
          .replace('{summary}', detailItem.summary || '')
          .replace('{title}', detailItem.title || '');
        result.canonical = toAbsolute(canonicalTemplate.replace('{slug}', detailItem.slug || '')) || result.canonical;
      }
    }

    return result;
  }

  function getExpertiseRouteItems(C) {
    var configuredItems = Array.isArray(C.expertise) ? C.expertise : [];
    var fallbackItems = Array.isArray(C.expertise_items) ? C.expertise_items : [];
    var seen = {};
    var expertise = configuredItems.map(function (item) {
      var title = item && item.title ? item.title : '';
      var slug = (item && item.slug ? item.slug : slugify(title)).toLowerCase();
      if (slug) seen[slug] = true;
      return Object.assign({}, item, { slug: slug });
    });

    fallbackItems.forEach(function (item) {
      var title = item && item.title ? item.title : '';
      var slug = ((item && item.slug) ? item.slug : slugify(title)).toLowerCase();
      if (!title || !slug || seen[slug]) return;
      seen[slug] = true;
      expertise.push({
        slug: slug,
        title: title,
        summary: item.description || '',
        hero_image: '',
        content_blocks: [
          {
            type: 'paragraph',
            heading: 'Overview',
            body: item.description || 'Details for this expertise area will be updated soon.'
          }
        ],
        related_slugs: []
      });
    });

    return expertise;
  }

  function getExcludedRouteSet(C) {
    var sections = C.sections || {};
    return {
      knowledgebase: !!(sections.knowledgebase && sections.knowledgebase.enabled === false),
      research_publications: !!(sections.research_publications && sections.research_publications.enabled === false)
    };
  }

  function initExclusionGuards(C) {
    var excluded = getExcludedRouteSet(C);
    if (!excluded.knowledgebase && !excluded.research_publications) return;

    var blocked = ['knowledgebase', 'research', 'publication'];
    document.querySelectorAll('a').forEach(function (link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      var text = (link.textContent || '').toLowerCase();
      var shouldHide = blocked.some(function (word) {
        return href.indexOf(word) !== -1 || text.indexOf(word) !== -1;
      });
      if (shouldHide) {
        var li = link.closest('li');
        if (li) {
          li.remove();
        } else {
          link.remove();
        }
      }
    });

    if (excluded.research_publications) {
      var researchSection = document.getElementById('research');
      if (researchSection) researchSection.hidden = true;
    }

    if (excluded.knowledgebase) {
      var kbSection = document.getElementById('knowledgebase');
      if (kbSection) kbSection.hidden = true;
    }
  }

  function buildOpeningHours(timing) {
    var specs = [];
    if (timing.weekdays) {
      specs.push(
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday'], 'opens': '09:00', 'closes': '13:00' },
        { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday'], 'opens': '17:00', 'closes': '20:00' }
      );
    }
    if (timing.saturday && timing.saturday.toLowerCase() !== 'closed') {
      specs.push({ '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Saturday'], 'opens': '09:00', 'closes': '14:00' });
    }
    return specs;
  }

  /* ============================================================
     2. NAVBAR
  ============================================================ */
  function initNavbar(C) {
    var clinic = C.clinic || {};
    var doc = C.doctor || {};

    // Clinic name in logo
    setTextById('clinic-name-nav-text', clinic.name || doc.name || '');
    setTextById('clinic-specialty-nav', doc.specialization || 'Head and Neck Cancer Treatment');

    // Scroll shadow
    var navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
      }, { passive: true });
    }

    // Mobile burger
    var burger = document.getElementById('nav-burger');
    var links  = document.getElementById('nav-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (navbar && !navbar.contains(e.target)) {
          links.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on link click
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ============================================================
     3. HERO
  ============================================================ */
  function initHero(C) {
    var doc    = C.doctor || {};
    var clinic = C.clinic || {};
    var heroPhoto = doc.photo_logo || doc.photo_hero || doc.photo || '';

    setTextById('hero-name',           doc.name           || '');
    setTextById('hero-specialization', doc.specialization || '');
    setTextById('hero-tagline',        doc.tagline        || '');
    setTextById('badge-experience',    (doc.experience_years || '') + '+');

    setImgById('hero-photo', heroPhoto, doc.name || 'Doctor');

    setAttrById('hero-whatsapp', 'href', buildWhatsAppUrl(
      clinic.whatsapp || '',
      'Hello ' + (doc.name || 'Doctor') + ', I would like to book an appointment.'
    ));
  }

  /* ============================================================
     4. ABOUT
  ============================================================ */
  function initAbout(C) {
    var doc = C.doctor || {};
    var aboutPhoto = doc.photo_about || doc.photo || doc.photo_hero || '';

    setImgById('about-photo', aboutPhoto, doc.name || 'Doctor');

    setTextById('about-name',           doc.name           || '');
    setTextById('about-degree',         doc.degree         || '');
    setTextById('about-specialization', doc.specialization || '');
    setTextById('about-languages', Array.isArray(doc.languages) ? doc.languages.join(' • ') : '');

    // Also update the heading (since we use the same about-name id logic)
    var heading = document.querySelector('#about .section__title');
    if (heading) heading.textContent = doc.name || '';

    // About text — each newline becomes a paragraph
    var aboutEl = document.getElementById('about-text');
    if (aboutEl && doc.about) {
      aboutEl.innerHTML = doc.about
        .split('\n')
        .filter(function (p) { return p.trim(); })
        .map(function (p) { return '<p>' + escHtml(p) + '</p>'; })
        .join('');
    }

    var credsEl = document.getElementById('about-credentials');
    if (credsEl) {
      var chips = [];
      if (doc.registration_number && doc.registration_number.indexOf('ADD_') === -1) {
        chips.push('Reg: ' + doc.registration_number);
      }
      if (Array.isArray(doc.certifications)) {
        chips = chips.concat(doc.certifications.filter(Boolean));
      }
      if (Array.isArray(doc.awards)) {
        chips = chips.concat(doc.awards.filter(function (a) {
          return a && a.indexOf('ADD_') === -1;
        }));
      }

      credsEl.innerHTML = chips.map(function (chip) {
        return '<span class="about__chip">' + escHtml(chip) + '</span>';
      }).join('');

      if (chips.length === 0) {
        credsEl.style.display = 'none';
      }
    }
  }

  /* ============================================================
     5. SERVICES GRID
  ============================================================ */
  function initServices(C) {
    var grid = document.getElementById('services-grid');
    if (!grid || !Array.isArray(C.services)) return;

    grid.innerHTML = C.services.map(function (s) {
      return (
        '<div class="service-card" role="listitem">' +
          '<div class="service-card__icon" aria-hidden="true">' + escHtml(s.icon || '') + '</div>' +
          '<h3 class="service-card__name">'  + escHtml(s.name        || '') + '</h3>' +
          '<p class="service-card__desc">'   + escHtml(s.description || '') + '</p>' +
          '<span class="service-card__price">' + escHtml(s.price_range || '') + '</span>' +
        '</div>'
      );
    }).join('');
  }

  /* ============================================================
     5A. EXPERTISE GRID (OPTIONAL)
  ============================================================ */
  function initExpertise(C) {
    var section = document.getElementById('expertise');
    var grid = document.getElementById('expertise-grid');
    var gallery = document.getElementById('expertise-gallery');
    var clinic = C.clinic || {};
    var items = Array.isArray(C.expertise_items_homepage) ? C.expertise_items_homepage : (Array.isArray(C.expertise_items) ? C.expertise_items : []);
    var expertiseImages = Array.isArray(clinic.expertise_images) ? clinic.expertise_images : [];
    var sectionConfig = C.expertise_section || {};

    if (!section || !grid || (items.length === 0 && expertiseImages.length === 0)) {
      if (section) section.hidden = true;
      return;
    }

    setTextById('expertise-label', sectionConfig.label || 'Special Focus');
    setTextById('expertise-heading', sectionConfig.title || 'Complete Expertise in Head and Neck Cancer Treatment');

    var subtitleEl = document.getElementById('expertise-subtitle');
    if (subtitleEl) {
      var subtitleText = sectionConfig.subtitle || '';
      subtitleEl.textContent = subtitleText;
      subtitleEl.hidden = !subtitleText;
    }

    var validExpertiseImages = expertiseImages
      .filter(function (src) { return typeof src === 'string' && src.trim(); })
      .map(function (src) { return src.trim(); });

    if (items.length) {
      grid.innerHTML = items.map(function (item, idx) {
        var title = escHtml(item.title || 'Expertise Area');
        var desc = escHtml(item.description || '');
        var externalLink = safeExternalUrl(item.read_more_url || '');
        var slug = ((item && item.slug) ? item.slug : slugify(item.title || '')).toLowerCase();
        var detailLink = buildExpertiseDetailUrl(slug);
        var link = externalLink || detailLink;

        var linkHtml = link
          ? '<a class="expertise-card__link" data-expertise-slug="' + escHtml(slug) + '" href="' + escHtml(link) + '"' + (externalLink ? ' target="_blank" rel="noopener noreferrer"' : '') + '>Read more</a>'
          : '';

        return (
          '<article class="expertise-card" role="listitem">' +
            '<h3 class="expertise-card__title">' + title + '</h3>' +
            '<p class="expertise-card__desc">' + desc + '</p>' +
            linkHtml +
          '</article>'
        );
      }).join('');
      grid.addEventListener('click', function (event) {
        var link = event.target && event.target.closest ? event.target.closest('[data-expertise-slug]') : null;
        if (!link) return;
        storeSelectedExpertiseSlug(link.getAttribute('data-expertise-slug') || '');
      });
      grid.hidden = false;

      if (gallery) {
        gallery.innerHTML = '';
        gallery.hidden = true;
      }
    } else {
      grid.innerHTML = '';
      grid.hidden = true;

      if (gallery && validExpertiseImages.length) {
        gallery.innerHTML = validExpertiseImages.map(function (src, idx) {
          var imageNo = idx + 1;
          return (
            '<a class="expertise-gallery-card" role="listitem" href="' + escHtml(src) + '" target="_blank" rel="noopener noreferrer" aria-label="Open expertise image ' + imageNo + '">' +
              '<img loading="lazy" src="' + escHtml(src) + '" alt="Expertise highlight image ' + imageNo + '" />' +
            '</a>'
          );
        }).join('');
        gallery.hidden = false;
      } else {
        if (gallery) {
          gallery.innerHTML = '';
          gallery.hidden = true;
        }
      }
    }

    section.hidden = false;
  }

  /* ============================================================
     6. ANIMATED COUNTERS (Why Choose Us)
  ============================================================ */
  function initCounters(C) {
    var doc = C.doctor || {};

    var patientsEl = document.getElementById('patients-counter');
    if (patientsEl) {
      var testimonialCount = Array.isArray(C.testimonials) ? C.testimonials.length : 0;
      var derivedPatients = Math.max(500, (doc.experience_years || 1) * 600 + testimonialCount * 50);
      patientsEl.dataset.target = String(derivedPatients);
      patientsEl.dataset.suffix = '+';
      delete patientsEl.dataset.decimal;
    }

    var ratingEl = document.getElementById('rating-counter');
    if (ratingEl) {
      var ratings = Array.isArray(C.testimonials) ? C.testimonials.map(function (t) {
        return parseFloat(t.rating || 0);
      }).filter(function (v) {
        return v >= 1 && v <= 5;
      }) : [];
      var avg = ratings.length ? (ratings.reduce(function (a, b) { return a + b; }, 0) / ratings.length) : 4.9;
      ratingEl.dataset.target = avg.toFixed(1);
      ratingEl.dataset.suffix = '★';
      ratingEl.dataset.decimal = 'true';
    }

    var transparencyEl = document.getElementById('transparency-counter');
    if (transparencyEl) {
      transparencyEl.dataset.target = '100';
      transparencyEl.dataset.suffix = '%';
      delete transparencyEl.dataset.decimal;
    }

    // Inject experience years from config
    var expEl = document.getElementById('experience-counter');
    if (expEl && doc.experience_years) {
      expEl.dataset.target = String(doc.experience_years);
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: set final values immediately
      document.querySelectorAll('.why-card__counter').forEach(finaliseCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.why-card__counter').forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target   = parseFloat(el.dataset.target || '0');
    var suffix   = el.dataset.suffix   || '';
    var isDecimal = el.dataset.decimal === 'true';
    var duration = 1800;
    var start    = performance.now();

    function update(ts) {
      var elapsed  = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      var current  = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  function finaliseCounter(el) {
    var target    = parseFloat(el.dataset.target || '0');
    var suffix    = el.dataset.suffix   || '';
    var isDecimal = el.dataset.decimal === 'true';
    el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
  }

  /* ============================================================
     7. APPOINTMENT FORM + RAZORPAY + WHATSAPP
  ============================================================ */
  function initAppointmentForm(C) {
    var payment = C.payment || {};
    var clinic  = C.clinic  || {};
    var doc     = C.doctor  || {};

    // Fee note
    var feeNote = document.getElementById('fee-note');
    if (feeNote) {
      feeNote.textContent =
        '💳 Consultation fee: ₹' + (payment.consultation_fee || 500) +
        ' — paid securely online via Razorpay to confirm your slot.';
    }

    // Update fee note based on payment option
        // Update Pay Now label with dynamic fee
    var payNowLabel = document.getElementById('pay-now-label');
    if (payNowLabel) payNowLabel.textContent = 'Pay Now (₹' + (payment.consultation_fee || 500) + ')';

    var paymentRadios = document.querySelectorAll('input[name="payment_option"]');
    if (feeNote && paymentRadios.length > 0) {
      paymentRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
          if (this.value === 'pay_later') {
            feeNote.textContent = '⏳ You can pay after the consultation. The doctor will confirm your appointment details via WhatsApp.';
            feeNote.style.backgroundColor = '#E8F8F5';
            feeNote.style.borderLeftColor = '#27AE60';
            feeNote.style.color = '#27AE60';
          } else {
            feeNote.textContent = '💳 Consultation fee: ₹' + (payment.consultation_fee || 500) +
              ' — paid securely online via Razorpay to confirm your slot.';
            feeNote.style.backgroundColor = '#EBF5FB';
            feeNote.style.borderLeftColor = 'var(--primary)';
            feeNote.style.color = 'var(--primary)';
          }
        });
      });
    }

    // Populate service dropdown from config
    var serviceSelect = document.getElementById('apt-service');
    if (serviceSelect && Array.isArray(C.services)) {
      C.services.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value       = s.name;
        opt.textContent = s.name + (s.price_range ? '  (' + s.price_range + ')' : '');
        serviceSelect.appendChild(opt);
      });
      var otherOpt = document.createElement('option');
      otherOpt.value = 'Other';
      otherOpt.textContent = 'Other';
      serviceSelect.appendChild(otherOpt);
    }

    // Populate location dropdown from visit_locations
    var locationSelect = document.getElementById('apt-location');
    if (locationSelect) {
      var visitLocations = Array.isArray(clinic.visit_locations) ? clinic.visit_locations : [];
      if (visitLocations.length > 0) {
        visitLocations.forEach(function (loc) {
          var opt = document.createElement('option');
          opt.value = loc.name + ', ' + loc.city;
          opt.textContent = loc.name + ' — ' + loc.city;
          locationSelect.appendChild(opt);
        });
      } else {
        var opt = document.createElement('option');
        opt.value = (clinic.name || 'Clinic') + ', ' + (clinic.city || '');
        opt.textContent = (clinic.name || 'Clinic') + ' — ' + (clinic.city || '');
        locationSelect.appendChild(opt);
      }
    }

    // Render service cards with SVG icons
    var servicesContainer = document.getElementById('services-grid');
    if (servicesContainer && Array.isArray(C.services)) {
      // Clear existing content
      servicesContainer.innerHTML = '';
      console.log('[DEBUG] Rendering ' + C.services.length + ' services to container:', servicesContainer);
      
      C.services.forEach(function (s) {
        var card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('role', 'listitem');
        
        var iconHTML = '';
        if (s.icon && (s.icon.endsWith('.svg') || s.icon.endsWith('.png') || s.icon.endsWith('.jpg') || s.icon.endsWith('.jpeg'))) {
          // Use path from config (supports both SVG and image files)
          var iconPath = s.icon;
          console.log('[DEBUG] Creating img tag with src:', iconPath);
          iconHTML = '<img src="' + iconPath + '" alt="' + s.name + '" class="service-icon" loading="lazy" style="width: 80px; height: 80px; object-fit: contain;">';
        } else {
          iconHTML = '<div class="service-icon" style="font-size: 2.5rem;">' + (s.icon || '✓') + '</div>';
        }
        
        card.innerHTML = iconHTML + '<h3>' + s.name + '</h3><p>' + s.description + '</p>';
        servicesContainer.appendChild(card);
      });
      console.log('[DEBUG] Service cards rendered successfully');
    } else {
      console.warn('[DEBUG] Services container not found or services not an array');
    }

    // Block past dates
    var dateInput = document.getElementById('apt-date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Form submission
    var form = document.getElementById('appointment-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      var formData = {
        name:    form.elements['name'].value.trim(),
        phone:   form.elements['phone'].value.trim(),
        date:    form.elements['date'].value,
        location: form.elements['location'] ? form.elements['location'].value : '',
        service: form.elements['service'].value,
        message: form.elements['message'].value.trim(),
        payment_option: form.elements['payment_option'].value
      };

      trackDoctorEvent('appointment_submit', {
        service: formData.service,
        payment_option: formData.payment_option
      });

      // If pay_later, skip Razorpay and go directly to WhatsApp
      if (formData.payment_option === 'pay_later') {
        console.log('[DoctorSite] Payment option: Pay Later - skipping Razorpay');
        fallbackWhatsApp(formData, clinic, doc, document.getElementById('submit-btn'), true);
      } else {
        initiatePayment(formData, payment, clinic, doc);
      }
    });
  }

  function validateForm(form) {
    var valid  = true;
    var fields = [
      { name: 'name',    label: 'Full name is required.' },
      { name: 'phone',   label: 'Phone number is required.' },
      { name: 'date',    label: 'Please select a date.' },
      { name: 'location', label: 'Please select a location.' },
      { name: 'service', label: 'Please select a service.' }
    ];

    fields.forEach(function (f) {
      var input   = form.elements[f.name];
      var errorId = 'apt-' + f.name + '-error';
      var errorEl = document.getElementById(errorId);

      if (!input) return;

      // Reset
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';

      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = f.label;
        valid = false;
        return;
      }

      // Phone validation
      if (f.name === 'phone' && !/^[0-9+\s\-]{10,15}$/.test(input.value.trim())) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = 'Enter a valid 10-digit phone number.';
        valid = false;
      }
    });

    if (!valid) {
      // Scroll to first error
      var firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  function initiatePayment(formData, payment, clinic, doc) {
    var submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.disabled     = true;
      submitBtn.textContent  = 'Processing…';
    }

    var key = payment.razorpay_key_id || '';
    console.log('[DoctorSite] Razorpay Key:', key);
    console.log('[DoctorSite] Payment Config:', payment);
    
    if (!key || key === 'rzp_live_XXXXXXXXXXXXXXXXXX') {
      console.warn('[DoctorSite] Razorpay key not configured — falling back to WhatsApp.');
      fallbackWhatsApp(formData, clinic, doc, submitBtn);
      return;
    }

    console.log('[DoctorSite] Attempting to load Razorpay...');
    ensureRazorpayLoaded()
      .then(function () {
        console.log('[DoctorSite] Razorpay loaded successfully, opening checkout...');
        openRazorpayCheckout(formData, payment, clinic, doc, submitBtn, key);
      })
      .catch(function (err) {
        console.warn('[DoctorSite] Razorpay not available — falling back to WhatsApp.', err);
        fallbackWhatsApp(formData, clinic, doc, submitBtn);
      });
  }

  function ensureRazorpayLoaded() {
    console.log('[DoctorSite] Checking Razorpay availability...');
    if (typeof Razorpay !== 'undefined') {
      console.log('[DoctorSite] Razorpay already loaded');
      return Promise.resolve();
    }

    if (razorpayLoaderPromise) {
      return razorpayLoaderPromise;
    }

    razorpayLoaderPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = function () {
        if (typeof Razorpay !== 'undefined') {
          resolve();
          return;
        }

        razorpayLoaderPromise = null;
        reject(new Error('Razorpay script loaded but SDK was unavailable.'));
      };
      script.onerror = function () {
        razorpayLoaderPromise = null;
        reject(new Error('Razorpay script failed to load.'));
      };
      document.head.appendChild(script);
    });

    return razorpayLoaderPromise;
  }

  function openRazorpayCheckout(formData, payment, clinic, doc, submitBtn, key) {
    console.log('[DoctorSite] Opening Razorpay checkout with key:', key);

    var options = {
      key:         key,
      amount:      (payment.consultation_fee || 500) * 100,
      currency:    payment.currency || 'INR',
      name:        clinic.name || 'Clinic',
      description: 'Consultation Fee — ' + formData.service,
      prefill: {
        name:    formData.name,
        contact: formData.phone
      },
      theme: { color: '#1B4F72' },
      handler: function (response) {
        console.log('[DoctorSite] Payment successful:', response.razorpay_payment_id);
        sendWhatsApp(formData, clinic, doc, response.razorpay_payment_id);
        showConfirmation(formData, response.razorpay_payment_id);
        resetSubmitBtn(submitBtn);
        document.getElementById('appointment-form').reset();
      },
      modal: {
        ondismiss: function () {
          console.log('[DoctorSite] Razorpay modal dismissed');
          resetSubmitBtn(submitBtn);
        },
        escape: true
      }
    };

    console.log('[DoctorSite] Razorpay options:', options);
    
    try {
      var rzp = new Razorpay(options);
      console.log('[DoctorSite] Razorpay instance created, opening modal...');
      rzp.on('payment.failed', function (resp) {
        console.log('[DoctorSite] Payment failed:', resp);
        var desc = (resp.error && resp.error.description) ? resp.error.description : 'Unknown error.';
        alert('⚠️ Payment failed: ' + desc + '\nPlease try again or contact the clinic directly.');
        resetSubmitBtn(submitBtn);
      });
      rzp.open();
    } catch (err) {
      console.error('[DoctorSite] Razorpay error:', err);
      fallbackWhatsApp(formData, clinic, doc, submitBtn);
    }
  }

  function fallbackWhatsApp(formData, clinic, doc, submitBtn, skipConfirm) {
    resetSubmitBtn(submitBtn);
    
    // If skipConfirm is true (pay_later), send directly without asking
    if (skipConfirm) {
      sendWhatsApp(formData, clinic, doc, null);
      showConfirmation(formData, null, formData.payment_option);
      document.getElementById('appointment-form').reset();
      return;
    }
    
    // Otherwise show confirmation dialog (fallback due to payment error)
    if (confirm(
      'Online payment is currently unavailable.\n\n' +
      'Click OK to send your appointment request via WhatsApp instead.'
    )) {
      sendWhatsApp(formData, clinic, doc, null);
      showConfirmation(formData, null);
      document.getElementById('appointment-form').reset();
    }
  }

  function resetSubmitBtn(btn) {
    if (!btn) return;
    btn.disabled    = false;
    btn.textContent = 'Confirm & Pay Consultation Fee';
  }

  /* ---- WhatsApp ---- */
  function buildWhatsAppUrl(number, message) {
    var clean = (number || '').replace(/[^0-9]/g, '');
    if (!clean) return '#';
    return 'https://wa.me/' + clean + '?text=' + encodeURIComponent(message);
  }

  function sendWhatsApp(formData, clinic, doc, paymentId) {
    var paymentStatus = paymentId ? '💳 Payment : ' + paymentId : 
                       (formData.payment_option === 'pay_later' ? '💳 Payment : To be paid after consultation' : '💳 Payment : Pending');
    
    var lines = [
      '🏥 *New Appointment Request*',
      '━━━━━━━━━━━━━━━━━━━━',
      '👤 Patient : ' + formData.name,
      '📞 Phone   : ' + formData.phone,
      '📍 Location: ' + (formData.location || 'Not specified'),
      '🦷 Service : ' + formData.service,
      '📅 Date    : ' + formatDate(formData.date),
      paymentStatus,
      formData.message ? '💬 Message : ' + formData.message : '',
      '━━━━━━━━━━━━━━━━━━━━',
      'Sent via ' + (doc.name || clinic.name || 'Clinic') + ' website'
    ].filter(Boolean);

    var url = buildWhatsAppUrl(clinic.whatsapp || '', lines.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ---- Confirmation Modal ---- */
  function showConfirmation(formData, paymentId, paymentOption) {
    var modal   = document.getElementById('confirmation-modal');
    var details = document.getElementById('modal-details');
    if (!modal || !details) return;

    var paymentStatus = paymentId ? paymentId : 
                       (paymentOption === 'pay_later' ? 'To be paid after consultation' : 'N/A');

    var rows = [
      ['Patient',    formData.name],
      ['Phone',      formData.phone],
      ['Service',    formData.service],
      ['Date',       formatDate(formData.date)],
      ['Payment',    paymentStatus]
    ];

    details.innerHTML = rows.map(function (r) {
      return '<p><strong>' + escHtml(r[0]) + ':</strong> ' + escHtml(r[1]) + '</p>';
    }).join('');

    modal.removeAttribute('hidden');

    var closeBtn = document.getElementById('modal-close');
    var overlay  = document.getElementById('modal-overlay');
    function closeModal() { modal.setAttribute('hidden', ''); }
    if (closeBtn) closeBtn.onclick  = closeModal;
    if (overlay)  overlay.onclick   = closeModal;

    // Trap focus inside modal
    modal.querySelector('.btn').focus();
  }

  /* ============================================================
     8. TESTIMONIALS
  ============================================================ */
  function initTestimonials(C) {
    var grid = document.getElementById('testimonials-grid');
    var gallery = document.getElementById('testimonials-gallery');
    var section = document.getElementById('testimonials');
    var actions = document.getElementById('testimonials-actions');
    var clinic = C.clinic || {};
    var reviews = Array.isArray(C.testimonials) ? C.testimonials : [];
    var galleryImages = Array.isArray(clinic.homepage_images) && clinic.homepage_images.length
      ? clinic.homepage_images
      : (Array.isArray(clinic.images) && clinic.images.length
        ? clinic.images
        : (Array.isArray(clinic.photos) ? clinic.photos : []));

    if (!grid || !gallery || (!reviews.length && !galleryImages.length)) {
      if (section) section.hidden = true;
      return;
    }

    if (reviews.length) {
      grid.innerHTML = reviews.map(function (t) {
        var rating  = Math.min(5, Math.max(1, parseInt(t.rating, 10) || 5));
        var filled  = '★'.repeat(rating);
        var empty   = '☆'.repeat(5 - rating);

        return (
          '<div class="testimonial-card" role="listitem">' +
            '<div class="testimonial-card__stars" aria-label="' + rating + ' out of 5 stars">' +
              filled + empty +
            '</div>' +
            '<p class="testimonial-card__text">"' + escHtml(t.text || t.review_text || '') + '"</p>' +
            '<div class="testimonial-card__footer">' +
              '<span class="testimonial-card__name">' + escHtml(t.name || t.patient_name || '') + '</span>' +
              '<span class="testimonial-card__meta">' + escHtml(t.location || t.treatment || '') + ' · ' + escHtml(t.date || (t.created_at ? t.created_at.slice(0,7) : '') || '') + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join('');
      grid.hidden = false;
    } else {
      grid.innerHTML = '';
      grid.hidden = true;
    }

    var validGalleryImages = galleryImages
      .filter(function (src) { return typeof src === 'string' && src.trim(); })
      .map(function (src) { return src.trim(); });

    if (validGalleryImages.length) {
      gallery.innerHTML = validGalleryImages.map(function (src, idx) {
        var itemNo = idx + 1;
        return (
          '<button class="testimonial-gallery-card" role="listitem" type="button" data-gallery-index="' + idx + '" aria-label="Open case image ' + itemNo + '">' +
            '<img loading="lazy" src="' + escHtml(src) + '" alt="Case highlight image ' + itemNo + '" />' +
            '<span class="testimonial-gallery-card__meta">Case ' + itemNo + '</span>' +
          '</button>'
        );
      }).join('');
      gallery.hidden = false;
      setupTestimonialLightbox(validGalleryImages);
    } else {
      gallery.innerHTML = '';
      gallery.hidden = true;
    }

    if (actions) {
      var reviewUrl = safeExternalUrl(C.social && C.social.google_business ? C.social.google_business : '');
      if (reviewUrl) {
        actions.innerHTML =
          '<a class="btn btn--primary" href="' + escHtml(reviewUrl) + '" target="_blank" rel="noopener noreferrer">Review us on Google</a>';
        actions.hidden = false;
      } else {
        actions.innerHTML = '';
        actions.hidden = true;
      }
    }
  }

  function initCaseArchive(C) {
    var clinic = C.clinic || {};
    var section = document.getElementById('case-archive');
    var gallery = document.getElementById('case-archive-gallery');
    var archiveImages = Array.isArray(clinic.case_archive_images) ? clinic.case_archive_images : [];

    if (!section || !gallery || archiveImages.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    var validArchiveImages = archiveImages
      .filter(function (src) { return typeof src === 'string' && src.trim(); })
      .map(function (src) { return src.trim(); });

    if (!validArchiveImages.length) {
      section.hidden = true;
      return;
    }

    gallery.innerHTML = validArchiveImages.map(function (src, idx) {
      var imageNo = idx + 1;
      return (
        '<a class="case-archive-card" role="listitem" href="' + escHtml(src) + '" target="_blank" rel="noopener noreferrer" aria-label="Open archive case image ' + imageNo + '">' +
          '<img loading="lazy" src="' + escHtml(src) + '" alt="Archived clinical case image ' + imageNo + '" />' +
          '<span class="case-archive-card__meta">Archive ' + imageNo + '</span>' +
        '</a>'
      );
    }).join('');

    section.hidden = false;
  }

  function setupTestimonialLightbox(images) {
    var lightbox = document.getElementById('testimonial-lightbox');
    var gallery = document.getElementById('testimonials-gallery');
    var imgEl = document.getElementById('testimonial-lightbox-image');
    var captionEl = document.getElementById('testimonial-lightbox-caption');
    var closeBtn = document.getElementById('testimonial-lightbox-close');
    var prevBtn = document.getElementById('testimonial-lightbox-prev');
    var nextBtn = document.getElementById('testimonial-lightbox-next');
    var backdrop = document.getElementById('testimonial-lightbox-backdrop');
    if (!lightbox || !gallery || !imgEl || !captionEl || !closeBtn || !prevBtn || !nextBtn || !backdrop) return;

    var activeIndex = 0;

    function renderActiveImage() {
      var src = images[activeIndex] || '';
      var label = 'Case ' + (activeIndex + 1) + ' of ' + images.length;
      imgEl.src = src;
      imgEl.alt = label;
      captionEl.textContent = label;
    }

    function openLightbox(index) {
      activeIndex = Math.max(0, Math.min(images.length - 1, index));
      renderActiveImage();
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    function showPrev() {
      activeIndex = (activeIndex - 1 + images.length) % images.length;
      renderActiveImage();
    }

    function showNext() {
      activeIndex = (activeIndex + 1) % images.length;
      renderActiveImage();
    }

    gallery.onclick = function (e) {
      var btn = e.target.closest('.testimonial-gallery-card');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-gallery-index'), 10);
      openLightbox(isNaN(idx) ? 0 : idx);
    };

    closeBtn.onclick = closeLightbox;
    backdrop.onclick = closeLightbox;
    prevBtn.onclick = showPrev;
    nextBtn.onclick = showNext;

    lightbox.onkeydown = function (e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
  }

  /* ============================================================
     9. FAQ ACCORDION (Schema-optimised)
  ============================================================ */
  function initFAQ(C) {
    var list = document.getElementById('faq-list');
    var section = document.getElementById('faq');
    if (!list || !Array.isArray(C.faqs) || C.faqs.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    list.innerHTML = C.faqs.map(function (f, i) {
      var questionId = 'faq-question-' + i;
      var answerId   = 'faq-answer-' + i;
      return (
        '<div class="faq__item" id="faq-item-' + i + '">' +
          '<button' +
            ' class="faq__question"' +
            ' id="' + questionId + '"' +
            ' aria-expanded="false"' +
            ' aria-controls="' + answerId + '"' +
          '>' +
            escHtml(f.question || '') +
            '<span class="faq__arrow" aria-hidden="true">+</span>' +
          '</button>' +
          '<div' +
            ' class="faq__answer"' +
            ' id="' + answerId + '"' +
            ' role="region"' +
            ' aria-labelledby="' + questionId + '"' +
          '>' +
            escHtml(f.answer || '') +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Accordion click handler (one-open-at-a-time)
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__question');
      if (!btn) return;

      var item   = btn.closest('.faq__item');
      var isOpen = item.classList.contains('open');

      // Close all
      list.querySelectorAll('.faq__item').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ============================================================
     10. CONTACT + GOOGLE MAPS
  ============================================================ */
  function initContact(C) {
    var clinic = C.clinic || {};
    var timing = clinic.timing || {};
    var showTimingRaw = clinic.show_timing;
    var showTiming = !(showTimingRaw === false || showTimingRaw === 0 ||
      (typeof showTimingRaw === 'string' && /^(false|off|no|0)$/i.test(showTimingRaw.trim())));

    setTextById('contact-address', (clinic.address || '') + ', ' + (clinic.city || ''));

    var phoneEl = document.getElementById('contact-phone');
    if (phoneEl) {
      phoneEl.textContent = clinic.phone || '';
      phoneEl.href        = 'tel:' + (clinic.phone || '').replace(/\s/g, '');
    }

    var emailEl = document.getElementById('contact-email');
    if (emailEl) {
      emailEl.textContent = clinic.email || '';
      emailEl.href        = 'mailto:' + (clinic.email || '');
    }

    var timingEl = document.getElementById('contact-timing');
    if (timingEl) {
      var timingItem = document.getElementById('contact-timing-item') || timingEl.closest('li');
      var hasTimingData = !!(timing.weekdays || timing.saturday || timing.sunday);

      if (!showTiming || !hasTimingData) {
        timingEl.innerHTML = '';
        if (timingItem) {
          timingItem.hidden = true;
          timingItem.style.display = 'none';
        }
      } else {
        timingEl.innerHTML =
          '<p>Mon – Fri: ' + escHtml(timing.weekdays || '') + '</p>' +
          '<p>Saturday: '  + escHtml(timing.saturday || '') + '</p>' +
          '<p>Sunday: '    + escHtml(timing.sunday   || 'Closed') + '</p>';
        if (timingItem) {
          timingItem.hidden = false;
          timingItem.style.removeProperty('display');
        }
      }
    }

    // Visit locations cards
    var locations = Array.isArray(clinic.visit_locations) ? clinic.visit_locations : [];
    if (locations.length > 0) {
      var locContainer = document.getElementById('contact-locations');
      if (locContainer) {
        var locHtml = '<div class="visit-locations">' +
          '<p class="visit-locations__title">\ud83d\udccd Our Locations</p>' +
          '<div class="visit-locations__cards">';
        locations.forEach(function (loc, idx) {
          var badge = loc.is_primary
            ? '<span class="visit-location-card__badge visit-location-card__badge--primary">Primary</span>'
            : '<span class="visit-location-card__badge visit-location-card__badge--visit">Visit</span>';
          locHtml += '<div class="visit-location-card' + (idx === 0 ? ' active' : '') + '" data-loc-idx="' + idx + '" role="button" tabindex="0">' +
            '<span class="visit-location-card__icon">\ud83c\udfe5</span>' +
            '<div class="visit-location-card__info">' +
              '<div class="visit-location-card__name">' + escHtml(loc.name || '') + '</div>' +
              '<div class="visit-location-card__address">' + escHtml(loc.address || '') + '</div>' +
              badge +
            '</div></div>';
        });
        locHtml += '</div></div>';
        locContainer.innerHTML = locHtml;

        // Wire map switching
        var mapTarget = document.getElementById('contact-map');
        locContainer.querySelectorAll('.visit-location-card').forEach(function (card) {
          card.addEventListener('click', function () {
            var idx = parseInt(card.getAttribute('data-loc-idx'), 10);
            var loc = locations[idx];
            if (!loc) return;
            locContainer.querySelectorAll('.visit-location-card').forEach(function (c) { c.classList.remove('active'); });
            card.classList.add('active');
            var mapUrl = 'https://www.google.com/maps?q=' + encodeURIComponent((loc.address || '') + ', ' + (loc.city || '')) + '&z=15&output=embed';
            if (mapTarget) {
              mapTarget.innerHTML = '';
              var iframe = document.createElement('iframe');
              iframe.src = mapUrl; iframe.loading = 'lazy'; iframe.allowFullscreen = true;
              iframe.referrerPolicy = 'no-referrer-when-downgrade';
              iframe.title = (loc.name || 'Location') + ' Map';
              mapTarget.appendChild(iframe);
            }
          });
        });
      }
    }

    var mapEl = document.getElementById('contact-map');
    if (mapEl) {
      var mapUrl = getEmbeddableMapUrl(clinic);
      if (mapUrl) {
        mapEl.innerHTML = '';
        var iframe = document.createElement('iframe');
        iframe.src                   = mapUrl;
        iframe.loading               = 'lazy';
        iframe.allowFullscreen       = true;
        iframe.referrerPolicy        = 'no-referrer-when-downgrade';
        iframe.title                 = (clinic.name || 'Clinic') + ' Location';
        iframe.setAttribute('aria-label', 'Map showing clinic location');
        mapEl.appendChild(iframe);
      } else {
        mapEl.innerHTML =
          '<div class="contact__map--placeholder">' +
            '<span style="font-size:2rem">📍</span>' +
            '<span>Add <code>google_maps_embed</code> or <code>geo</code> in doctor-profile.json</span>' +
          '</div>';
      }
    }
  }

  /* ============================================================
     11. FOOTER
  ============================================================ */
  function initFooter(C) {
    var clinic = C.clinic || {};
    var doc    = C.doctor || {};
    var social = C.social || {};

    setTextById('footer-clinic',    clinic.name  || '');
    setTextById('footer-tagline',   doc.tagline  || '');
    setTextById('footer-copyright',
      '© ' + new Date().getFullYear() + ' ' + (clinic.name || '') + '. All rights reserved.'
    );

    var socialEl = document.getElementById('footer-social');
    if (socialEl) {
      var links = [
        { url: safeExternalUrl(social.google_business), label: 'G',  title: 'Google Business' },
        { url: safeExternalUrl(social.instagram),       label: '📷', title: 'Instagram'       },
        { url: safeExternalUrl(social.facebook),        label: 'f',  title: 'Facebook'        }
      ].filter(function (l) {
        return !!l.url;
      });

      socialEl.innerHTML = links.map(function (l) {
        return (
          '<a href="' + escHtml(l.url) + '"' +
            ' target="_blank"' +
            ' rel="noopener noreferrer"' +
            ' title="' + escHtml(l.title) + '"' +
            ' aria-label="' + escHtml(l.title) + '"' +
          '>' + l.label + '</a>'
        );
      }).join('');

      if (links.length === 0) {
        socialEl.style.display = 'none';
      }
    }
  }

  /* ============================================================
     12. FLOATING WHATSAPP
  ============================================================ */
  /* ---- WhatsApp Smart Opener with Fallback ---- */
  function openWhatsAppSmart(phoneNumber, message) {
    var clean = (phoneNumber || '').replace(/[^0-9]/g, '');
    if (!clean) {
      alert('WhatsApp number not configured.');
      return;
    }

    var encodedMsg = encodeURIComponent(message);
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    var isAndroid = /Android/i.test(navigator.userAgent);

    if (!isMobile) {
      // Desktop: open wa.me in new window
      window.open('https://wa.me/' + clean + '?text=' + encodedMsg, '_blank');
      return;
    }

    // Mobile: Try regular WhatsApp first, then Business, then wa.me
    var openAttempt = 0;
    var maxAttempts = 3;

    function tryOpen() {
      openAttempt++;

      if (openAttempt === 1) {
        // Try regular WhatsApp
        if (isAndroid) {
          window.location.href = 'intent://send?phone=' + clean + '&text=' + encodedMsg + '#Intent;scheme=whatsapp;package=com.whatsapp;end;';
        } else {
          // iOS
          window.location.href = 'whatsapp://send?phone=' + clean + '&text=' + encodedMsg;
        }
      } else if (openAttempt === 2) {
        // Try WhatsApp Business
        if (isAndroid) {
          window.location.href = 'intent://send?phone=' + clean + '&text=' + encodedMsg + '#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end;';
        } else {
          // iOS - try WhatsApp Business scheme
          window.location.href = 'whatsappbusiness://send?phone=' + clean + '&text=' + encodedMsg;
        }
      } else if (openAttempt === 3) {
        // Fallback to wa.me
        window.location.href = 'https://wa.me/' + clean + '?text=' + encodedMsg;
      } else if (openAttempt >= 4) {
        // Show message if all failed
        alert('WhatsApp is not installed on your device.\n\nPlease install WhatsApp Messenger or WhatsApp Business to continue.\n\nPhone: ' + phoneNumber);
      }
    }

    // Try opening with delays between attempts
    tryOpen();
    
    // Retry after delays to handle app not installed cases
    setTimeout(function() {
      if (openAttempt === 1 && document.hidden === false) {
        tryOpen();
      }
    }, 500);

    setTimeout(function() {
      if (openAttempt === 2 && document.hidden === false) {
        tryOpen();
      }
    }, 1000);

    setTimeout(function() {
      if (openAttempt === 3 && document.hidden === false) {
        tryOpen();
      }
    }, 1500);
  }

  function initWhatsAppFloat(C) {
    var clinic = C.clinic || {};
    var doc    = C.doctor || {};

    var el = document.getElementById('whatsapp-float');
    if (!el && document.body) {
      el = document.createElement('a');
      el.id = 'whatsapp-float';
      el.className = 'whatsapp-float';
      el.setAttribute('aria-label', 'Chat on WhatsApp');
      el.innerHTML = '<svg class="whatsapp-float__icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span class="whatsapp-float__label">Chat with us</span>';
      document.body.appendChild(el);
    }

    var message = 'Hello ' + (doc.name || 'Doctor') + ', I would like to book an appointment.';
    var phoneNumber = clinic.whatsapp || '';

    if (el) {
      el.href = '#';
      el.onclick = function(e) {
        e.preventDefault();
        openWhatsAppSmart(phoneNumber, message);
        trackDoctorEvent('whatsapp_click', { source: 'floating_button' });
      };

      // Show label on desktop
      var label = el.querySelector('.whatsapp-float__label');
      if (label && window.innerWidth > 768) {
        label.style.display = 'inline';
      }
    }

    var heroWa = document.getElementById('hero-whatsapp');
    if (heroWa) {
      heroWa.href = '#';
      heroWa.onclick = function(e) {
        e.preventDefault();
        openWhatsAppSmart(phoneNumber, message);
        trackDoctorEvent('whatsapp_click', { source: 'hero_button' });
      };
    }

    var navWa = document.getElementById('navbar-whatsapp');
    if (navWa) {
      navWa.href = '#';
      navWa.onclick = function(e) {
        e.preventDefault();
        openWhatsAppSmart(phoneNumber, message);
        trackDoctorEvent('whatsapp_click', { source: 'navbar_button' });
      };
    }
  }

  function initCallFloat(C) {
    var clinic = C.clinic || {};

    var el = document.getElementById('call-float');
    if (!el && document.body) {
      el = document.createElement('a');
      el.id = 'call-float';
      el.className = 'call-float';
      el.setAttribute('aria-label', 'Call us directly');
      el.innerHTML = '<svg class="call-float__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"/></svg><span class="call-float__label">Call us</span>';
      document.body.appendChild(el);
    }

    var phoneNumber = (clinic.phone || '').split(/[\/,;|]+/)[0].trim();
    var callHref = phoneNumber ? 'tel:' + phoneNumber.replace(/[^0-9+]/g, '') : '#';

    if (el) {
      el.href = callHref;

      // Show label on desktop
      var label = el.querySelector('.call-float__label');
      if (label && window.innerWidth > 768) {
        label.style.display = 'inline';
      }
    }

    // Track call clicks
    if (el) {
      el.addEventListener('click', function () {
        trackDoctorEvent('call_click', { source: 'floating_button', phone: phoneNumber });
      });
    }
  }

  function initEngagementTracking(C) {
    var clinic = C.clinic || {};

    var heroWa = document.getElementById('hero-whatsapp');
    if (heroWa) {
      heroWa.addEventListener('click', function () {
        trackDoctorEvent('whatsapp_click', { source: 'hero' });
      });
    }

    var navWa = document.getElementById('navbar-whatsapp');
    if (navWa) {
      navWa.addEventListener('click', function () {
        trackDoctorEvent('whatsapp_click', { source: 'navbar' });
      });
    }

    var floatWa = document.getElementById('whatsapp-float');
    if (floatWa) {
      floatWa.addEventListener('click', function () {
        trackDoctorEvent('whatsapp_click', { source: 'float' });
      });
    }

    var phoneLink = document.getElementById('contact-phone');
    if (phoneLink && clinic.phone) {
      phoneLink.addEventListener('click', function () {
        trackDoctorEvent('phone_call_click', { source: 'contact', phone: clinic.phone });
      });
    }

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
      link.addEventListener('click', function () {
        trackDoctorEvent('whatsapp_click', { source: 'route' });
      });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        trackDoctorEvent('phone_call_click', { source: 'tel-link' });
      });
    });
  }

  /* ============================================================
     13. LAZY LOAD IMAGES
  ============================================================ */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[loading="lazy"][data-src]').forEach(function (img) {
      observer.observe(img);
    });
  }

  function initScrollRevealEffects() {
    var targets = document.querySelectorAll(
      '.section, .profile-card, .service-card, .why-card, .testimonial-card, .testimonial-gallery-card, .expertise-card, .case-archive-card, .faq__item, .contact__card, .contact__map, .key-point-card, .consultation-item, .treatment-item, .faq-item, .cta-box'
    );
    if (!targets.length) return;

    targets.forEach(function (el, index) {
      el.classList.add('reveal-on-scroll');
      el.style.transitionDelay = Math.min(index % 6, 5) * 55 + 'ms';
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.style.transitionDelay = '';
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     HELPERS
  ============================================================ */
  function setTextById(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function setAttrById(id, attr, value) {
    var el = document.getElementById(id);
    if (el) el.setAttribute(attr, value || '');
  }

  function setImgById(id, src, alt) {
    var el = document.getElementById(id);
    if (el) {
      el.src = src || '';
      if (alt) el.alt = alt;
    }
  }

  function setMetaName(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) { el.setAttribute('content', content); return; }
    // Create if missing
    var meta = document.createElement('meta');
    meta.name    = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  function setMetaProp(property, content) {
    var el = document.querySelector('meta[property="' + property + '"]');
    if (el) { el.setAttribute('content', content); return; }
    var meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.setAttribute('content',  content);
    document.head.appendChild(meta);
  }

  function absoluteUrl(path) {
    if (!path || path.startsWith('http')) return path || '';
    return window.location.origin + '/' + path.replace(/^\//, '');
  }

  function safeExternalUrl(url) {
    if (!url) return '';
    var value = String(url).trim();
    if (!value) return '';
    if (!/^https?:\/\//i.test(value)) return '';
    return value;
  }

  function getEmbeddableMapUrl(clinic) {
    var raw = String(clinic && clinic.google_maps_embed ? clinic.google_maps_embed : '').trim();

    // Keep already embeddable Google Maps URLs as-is.
    if (raw && (/google\.com\/maps\/embed/i.test(raw) || /[?&]output=embed/i.test(raw))) {
      return raw;
    }

    // Fallback to geo coordinates for reliable embed rendering.
    var lat = clinic && clinic.geo ? Number(clinic.geo.latitude) : NaN;
    var lng = clinic && clinic.geo ? Number(clinic.geo.longitude) : NaN;
    if (isFinite(lat) && isFinite(lng)) {
      return 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng) + '&z=15&output=embed';
    }

    // Final fallback: query by address.
    var address = [clinic && clinic.address, clinic && clinic.city, clinic && clinic.pincode]
      .filter(function (v) { return !!v; })
      .join(', ');
    if (address) {
      return 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
    }

    return '';
  }

  function buildExpertiseDetailUrl(slug) {
    var detailUrl = 'expertise-detail.html?slug=' + encodeURIComponent(slug || '');
    if (window.PREVIEW_TOKEN) detailUrl += '&preview=' + encodeURIComponent(window.PREVIEW_TOKEN);
    return detailUrl;
  }

  function storeSelectedExpertiseSlug(slug) {
    try {
      sessionStorage.setItem('selectedExpertiseSlug', slug || '');
    } catch (err) {
      // Continue normal navigation if storage is unavailable.
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      var d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function trackDoctorEvent(eventName, params) {
    if (window.trackDoctorEvent) {
      window.trackDoctorEvent(eventName, params || {});
    }
  }

  /* ============================================================
     PATIENT FEEDBACK FORM (FR-034 to FR-039)
  ============================================================ */
  function initFeedbackForm(C) {
    var section = document.getElementById('feedback');
    var feedbackCfg = C.feedback || {};

    // T063: Hide section when feedback.enabled is false or missing
    if (!feedbackCfg.enabled) {
      if (section) section.hidden = true;
      return;
    }

    if (!section) return;
    section.hidden = false;

    // Set custom form title if provided
    var heading = document.getElementById('feedback-heading');
    if (heading && feedbackCfg.form_title) {
      heading.textContent = feedbackCfg.form_title;
    }

    // Populate services dropdown from config
    var serviceSelect = document.getElementById('feedback-service');
    var services = Array.isArray(C.services) ? C.services : [];
    if (serviceSelect && feedbackCfg.services_dropdown !== false) {
      services.forEach(function (svc) {
        var opt = document.createElement('option');
        opt.value = svc.name;
        opt.textContent = svc.name;
        serviceSelect.appendChild(opt);
      });
      var otherOpt = document.createElement('option');
      otherOpt.value = 'Other';
      otherOpt.textContent = 'Other';
      serviceSelect.appendChild(otherOpt);
    } else if (serviceSelect && feedbackCfg.services_dropdown === false) {
      // Hide service field if dropdown is disabled
      var serviceGroup = serviceSelect.closest('.feedback-form__group');
      if (serviceGroup) serviceGroup.hidden = true;
    }

    // Interactive star rating
    var starsContainer = document.getElementById('feedback-stars');
    var ratingInput = document.getElementById('feedback-rating');
    var currentRating = 0;

    if (starsContainer) {
      var starButtons = starsContainer.querySelectorAll('.feedback-star');

      function updateStarDisplay(value) {
        starButtons.forEach(function (btn) {
          var btnVal = parseInt(btn.getAttribute('data-value'), 10);
          btn.innerHTML = btnVal <= value ? '&#9733;' : '&#9734;';
          btn.classList.toggle('feedback-star--active', btnVal <= value);
        });
      }

      starButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          currentRating = parseInt(btn.getAttribute('data-value'), 10);
          ratingInput.value = currentRating;
          updateStarDisplay(currentRating);
          clearError('feedback-rating-error');
        });

        btn.addEventListener('mouseenter', function () {
          var hoverVal = parseInt(btn.getAttribute('data-value'), 10);
          updateStarDisplay(hoverVal);
        });
      });

      starsContainer.addEventListener('mouseleave', function () {
        updateStarDisplay(currentRating);
      });

      // Keyboard navigation for stars
      starsContainer.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          currentRating = Math.min(5, currentRating + 1);
          ratingInput.value = currentRating;
          updateStarDisplay(currentRating);
          clearError('feedback-rating-error');
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          currentRating = Math.max(1, currentRating - 1);
          ratingInput.value = currentRating;
          updateStarDisplay(currentRating);
        }
      });
    }

    // Character count for text area
    var textArea = document.getElementById('feedback-text');
    var charCount = document.getElementById('feedback-charcount');
    if (textArea && charCount) {
      textArea.addEventListener('input', function () {
        charCount.textContent = textArea.value.length + '/500';
      });
    }

    // Form submission
    var form = document.getElementById('feedback-form');
    var submitBtn = document.getElementById('feedback-submit');
    var successDiv = document.getElementById('feedback-success');
    var errorDiv = document.getElementById('feedback-error');
    var retryBtn = document.getElementById('feedback-retry');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateFeedbackForm()) return;
        submitFeedback(feedbackCfg, C);
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        errorDiv.hidden = true;
        form.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
      });
    }

    function validateFeedbackForm() {
      var valid = true;
      var nameInput = document.getElementById('feedback-name');
      var serviceInput = document.getElementById('feedback-service');

      // Name validation
      var nameVal = (nameInput.value || '').trim();
      if (!nameVal) {
        showError('feedback-name-error', 'Please enter your name.');
        valid = false;
      } else if (nameVal.length > 100) {
        showError('feedback-name-error', 'Name must be 100 characters or less.');
        valid = false;
      } else {
        clearError('feedback-name-error');
      }

      // Rating validation
      if (!currentRating || currentRating < 1 || currentRating > 5) {
        showError('feedback-rating-error', 'Please select a rating.');
        valid = false;
      } else {
        clearError('feedback-rating-error');
      }

      // Service validation (only if dropdown is enabled)
      if (feedbackCfg.services_dropdown !== false) {
        var serviceVal = (serviceInput.value || '').trim();
        if (!serviceVal) {
          showError('feedback-service-error', 'Please select a service.');
          valid = false;
        } else {
          clearError('feedback-service-error');
        }
      }

      // Text validation
      var textVal = (textArea.value || '').trim();
      if (!textVal) {
        showError('feedback-text-error', 'Please share your feedback.');
        valid = false;
      } else if (textVal.length > 500) {
        showError('feedback-text-error', 'Feedback must be 500 characters or less.');
        valid = false;
      } else {
        clearError('feedback-text-error');
      }

      return valid;
    }

    function submitFeedback(cfg, config) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      var payload = {
        site_id: config.site_id || '',
        patient_name: document.getElementById('feedback-name').value.trim(),
        rating: currentRating,
        text: document.getElementById('feedback-text').value.trim(),
        service: document.getElementById('feedback-service').value.trim(),
        submitted_at: new Date().toISOString()
      };

      var endpoint = (cfg.api_endpoint || '').replace(/\/$/, '') + '/submit';
      var controller = new AbortController();
      var timeoutId = setTimeout(function () { controller.abort(); }, 10000);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
        .then(function (res) {
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          form.hidden = true;
          successDiv.hidden = false;
          var msg = document.getElementById('feedback-success-message');
          if (data.published) {
            msg.textContent = 'Your feedback has been published. Thank you for sharing your experience!';
          } else {
            msg.textContent = 'Thank you! Your feedback has been received and sent to the doctor for review.';
          }
        })
        .catch(function (err) {
          clearTimeout(timeoutId);
          form.hidden = true;
          errorDiv.hidden = false;
          var errMsg = document.getElementById('feedback-error-message');
          errMsg.textContent = 'Unable to submit feedback online. You can send your feedback via WhatsApp instead.';

          // Build WhatsApp fallback URL
          var whatsappLink = document.getElementById('feedback-whatsapp-fallback');
          var clinic = config.clinic || {};
          var phone = (clinic.whatsapp || clinic.phone || '').replace(/[^0-9+]/g, '').replace(/^\+/, '');
          var feedbackMsg = 'Patient Feedback:\n' +
            'Name: ' + payload.patient_name + '\n' +
            'Rating: ' + payload.rating + '/5 stars\n' +
            'Service: ' + payload.service + '\n' +
            'Feedback: ' + payload.text;
          whatsappLink.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(feedbackMsg);
        });
    }

    function showError(id, message) {
      var el = document.getElementById(id);
      if (el) { el.textContent = message; el.hidden = false; }
    }

    function clearError(id) {
      var el = document.getElementById(id);
      if (el) { el.textContent = ''; el.hidden = true; }
    }
  }

  /** XSS-safe HTML escape */
  function escHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  }

})();
