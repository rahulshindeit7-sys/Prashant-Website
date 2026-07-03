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
  fetch('./config/doctor-profile.json?v=' + Date.now())
    .then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status + ': config/doctor-profile.json not found.');
      }
      return res.json();
    })
    .then(function (config) {
      window.DOCTOR_CONFIG = config;
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

  /* ============================================================
     MAIN INIT
  ============================================================ */
  function init(C) {
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
      initCaseArchive(C);
      initFAQ(C);
      initContact(C);
      initFooter(C);
      initWhatsAppFloat(C);
      initEngagementTracking(C);
    } else {
      initSharedPageShell(C, ctx);
      initRoutePageContent(C, ctx);
      initWhatsAppFloat(C);
      initEngagementTracking(C);
    }

    initScrollRevealEffects();
    initLazyImages();
  }

  function getPageContext() {
    var routes = window.doctorRoutes || {};
    var page = typeof routes.detectPage === 'function' ? routes.detectPage() : 'home';
    var slug = typeof routes.readSlug === 'function' ? routes.readSlug() : '';
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
      navItems.push('<a href="index.html#' + escHtml(anchor.id) + '">' + escHtml(anchor.label) + '</a>');
    });

    if (pages.profile && pages.profile.enabled && !excluded.profile) {
      navItems.push('<a href="' + escHtml(pages.profile.path || 'profile.html') + '">' + escHtml(pages.profile.nav_label || 'Profile') + '</a>');
    }
    if (pages.expertise && pages.expertise.enabled && !excluded.expertise) {
      navItems.push('<a href="' + escHtml(pages.expertise.path || 'expertise.html') + '">' + escHtml(pages.expertise.nav_label || 'Expertise') + '</a>');
    }
    if (pages.contact && pages.contact.enabled && !excluded.contact) {
      navItems.push('<a href="' + escHtml(pages.contact.path || 'contact.html') + '">' + escHtml(pages.contact.nav_label || 'Contact') + '</a>');
    }

    if (header) {
      header.innerHTML =
        '<nav class="navbar" role="navigation" aria-label="Main Navigation">' +
          '<div class="container navbar__inner">' +
            '<a href="index.html" class="navbar__logo" aria-label="Home">' +
              '<span class="navbar__logo-text">' + escHtml(doc.name || clinic.name || 'Doctor Website') + '</span>' +
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
    var expertise = Array.isArray(C.expertise) ? C.expertise : [];
    var fallbackItems = Array.isArray(C.expertise_items) ? C.expertise_items : [];

    if (!expertise.length && fallbackItems.length) {
      expertise = fallbackItems.map(function (item) {
        var title = item.title || '';
        return {
          slug: slugify(title),
          title: title,
          summary: item.description || '',
          hero_image: '',
          content_blocks: [
            {
              type: 'paragraph',
              heading: 'Overview',
              body: item.description || ''
            }
          ],
          related_slugs: []
        };
      });
    }

    if (ctx.page === 'profile') {
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

        profileCreds.innerHTML += '<p><a class="btn btn--whatsapp" id="profile-whatsapp" href="#">WhatsApp Consultation</a></p>';
      }
      return;
    }

    if (ctx.page === 'expertise-list') {
      var expertiseHero = document.getElementById('expertise-hero-image');
      if (expertiseHero) {
        var firstImage = expertise.length && expertise[0].hero_image ? expertise[0].hero_image : '';
        setImgById('expertise-hero-image', firstImage, 'Expertise highlight image');
      }

      var list = document.getElementById('expertise-list');
      if (list) {
        list.innerHTML = expertise.map(function (item) {
          var slug = escHtml(item.slug || '');
          var waMessage = 'Hello ' + (doc.name || 'Doctor') + ', I want consultation for ' + (item.title || 'this expertise area') + '.';
          var waLink = buildWhatsAppUrl(clinic.whatsapp || '', waMessage);
          return (
            '<article class="service-card">' +
              '<h2 class="service-card__name">' + escHtml(item.title || '') + '</h2>' +
              '<p class="service-card__desc">' + escHtml(item.summary || '') + '</p>' +
              '<a class="btn btn--primary" href="expertise-detail.html?slug=' + slug + '">Read More</a> ' +
              '<a class="btn btn--whatsapp" href="' + escHtml(waLink) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
            '</article>'
          );
        }).join('');
      }
      return;
    }

    if (ctx.page === 'expertise-detail') {
      var detail = expertise.find(function (item) {
        return (item.slug || '') === ctx.slug;
      });
      setTextById('expertise-detail-heading', detail ? detail.title : 'Expertise Detail Not Found');
      setTextById('expertise-detail-summary', detail ? (detail.summary || '') : 'No content found for this topic.');
      setImgById('expertise-detail-hero', detail ? (detail.hero_image || '') : '', detail ? (detail.title || 'Expertise image') : 'Expertise detail image');
      var detailContent = document.getElementById('expertise-detail-content');
      if (detailContent) {
        if (!detail) {
          detailContent.innerHTML = '<p>Please return to the expertise listing and choose a valid topic.</p>';
        } else {
          var blocks = Array.isArray(detail.content_blocks) ? detail.content_blocks : [];
          detailContent.innerHTML = blocks.map(function (block) {
            var heading = block && block.heading ? '<h2>' + escHtml(block.heading) + '</h2>' : '';
            if (block && block.type === 'list' && Array.isArray(block.items)) {
              var items = block.items.map(function (entry) {
                return '<li>' + escHtml(entry) + '</li>';
              }).join('');
              return '<section>' + heading + '<ul>' + items + '</ul></section>';
            }
            return '<section>' + heading + '<p>' + escHtml(block && block.body ? block.body : '') + '</p></section>';
          }).join('');
        }
      }
      return;
    }

    if (ctx.page === 'contact') {
      var contactContent = document.getElementById('contact-content');
      if (contactContent) {
        var contactWa = buildWhatsAppUrl(clinic.whatsapp || '', 'Hello ' + (doc.name || 'Doctor') + ', I want to book an appointment.');
        contactContent.innerHTML =
          '<p><strong>Address:</strong> ' + escHtml((clinic.address || '') + ', ' + (clinic.city || '')) + '</p>' +
          '<p><strong>Phone:</strong> ' + escHtml(clinic.phone || '') + '</p>' +
          '<p><strong>Email:</strong> ' + escHtml(clinic.email || '') + '</p>' +
          '<p><a class="btn btn--whatsapp" id="contact-route-whatsapp" href="' + escHtml(contactWa) + '" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>';
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
      var detailItem = Array.isArray(C.expertise) ? C.expertise.find(function (item) {
        return (item.slug || '') === ctx.slug;
      }) : null;
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
    var items = Array.isArray(C.expertise_items) ? C.expertise_items : [];
    var expertiseImages = Array.isArray(clinic.expertise_images) ? clinic.expertise_images : [];
    var sectionConfig = C.expertise_section || {};

    if (!section || !grid || !gallery || (items.length === 0 && expertiseImages.length === 0)) {
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
        var imgSrc = validExpertiseImages.length
          ? validExpertiseImages[Math.min(validExpertiseImages.length - 1, idx)]
          : '';
        var title = escHtml(item.title || 'Expertise Area');
        var desc = escHtml(item.description || '');
        var link = safeExternalUrl(item.read_more_url || '');

        var mediaHtml = imgSrc
          ? '<div class="expertise-card__media"><img loading="lazy" src="' + escHtml(imgSrc) + '" alt="Clinical image for ' + title + '" /></div>'
          : '';

        var linkHtml = link
          ? '<a class="expertise-card__link" href="' + escHtml(link) + '" target="_blank" rel="noopener noreferrer">Read more</a>'
          : '';

        return (
          '<article class="expertise-card" role="listitem">' +
            mediaHtml +
            '<h3 class="expertise-card__title">' + title + '</h3>' +
            '<p class="expertise-card__desc">' + desc + '</p>' +
            linkHtml +
          '</article>'
        );
      }).join('');
      grid.hidden = false;

      gallery.innerHTML = '';
      gallery.hidden = true;
    } else {
      grid.innerHTML = '';
      grid.hidden = true;

      if (validExpertiseImages.length) {
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
        gallery.innerHTML = '';
        gallery.hidden = true;
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

    // Populate service dropdown from config
    var serviceSelect = document.getElementById('apt-service');
    if (serviceSelect && Array.isArray(C.services)) {
      C.services.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value       = s.name;
        opt.textContent = s.name + (s.price_range ? '  (' + s.price_range + ')' : '');
        serviceSelect.appendChild(opt);
      });
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
        time:    form.elements['time'].value,
        service: form.elements['service'].value,
        message: form.elements['message'].value.trim()
      };

      trackDoctorEvent('appointment_submit', {
        service: formData.service
      });

      initiatePayment(formData, payment, clinic, doc);
    });
  }

  function validateForm(form) {
    var valid  = true;
    var fields = [
      { name: 'name',    label: 'Full name is required.' },
      { name: 'phone',   label: 'Phone number is required.' },
      { name: 'date',    label: 'Please select a date.' },
      { name: 'time',    label: 'Please select a time slot.' },
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
    if (!key || key === 'rzp_live_XXXXXXXXXXXXXXXXXX') {
      console.warn('[DoctorSite] Razorpay key not configured — falling back to WhatsApp.');
      fallbackWhatsApp(formData, clinic, doc, submitBtn);
      return;
    }

    ensureRazorpayLoaded()
      .then(function () {
        openRazorpayCheckout(formData, payment, clinic, doc, submitBtn, key);
      })
      .catch(function (err) {
        console.warn('[DoctorSite] Razorpay not available — falling back to WhatsApp.', err);
        fallbackWhatsApp(formData, clinic, doc, submitBtn);
      });
  }

  function ensureRazorpayLoaded() {
    if (typeof Razorpay !== 'undefined') {
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
        sendWhatsApp(formData, clinic, doc, response.razorpay_payment_id);
        showConfirmation(formData, response.razorpay_payment_id);
        resetSubmitBtn(submitBtn);
        document.getElementById('appointment-form').reset();
      },
      modal: {
        ondismiss: function () {
          resetSubmitBtn(submitBtn);
        },
        escape: true
      }
    };

    try {
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function (resp) {
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

  function fallbackWhatsApp(formData, clinic, doc, submitBtn) {
    resetSubmitBtn(submitBtn);
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
    var lines = [
      '🏥 *New Appointment Request*',
      '━━━━━━━━━━━━━━━━━━━━',
      '👤 Patient : ' + formData.name,
      '📞 Phone   : ' + formData.phone,
      '🦷 Service : ' + formData.service,
      '📅 Date    : ' + formatDate(formData.date),
      '🕐 Time    : ' + formData.time,
      paymentId ? '💳 Payment : ' + paymentId : '💳 Payment : Pending',
      formData.message ? '💬 Message : ' + formData.message : '',
      '━━━━━━━━━━━━━━━━━━━━',
      'Sent via ' + (clinic.name || 'Clinic') + ' website'
    ].filter(Boolean);

    var url = buildWhatsAppUrl(clinic.whatsapp || '', lines.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ---- Confirmation Modal ---- */
  function showConfirmation(formData, paymentId) {
    var modal   = document.getElementById('confirmation-modal');
    var details = document.getElementById('modal-details');
    if (!modal || !details) return;

    var rows = [
      ['Patient',    formData.name],
      ['Phone',      formData.phone],
      ['Service',    formData.service],
      ['Date',       formatDate(formData.date)],
      ['Time',       formData.time],
      ['Payment ID', paymentId || 'N/A']
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
            '<p class="testimonial-card__text">"' + escHtml(t.text || '') + '"</p>' +
            '<div class="testimonial-card__footer">' +
              '<span class="testimonial-card__name">' + escHtml(t.name     || '') + '</span>' +
              '<span class="testimonial-card__meta">' + escHtml(t.location || '') + ' · ' + escHtml(t.date || '') + '</span>' +
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
  function initWhatsAppFloat(C) {
    var clinic = C.clinic || {};
    var doc    = C.doctor || {};

    var el = document.getElementById('whatsapp-float');
    if (!el && document.body) {
      el = document.createElement('a');
      el.id = 'whatsapp-float';
      el.className = 'whatsapp-float';
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.setAttribute('aria-label', 'Chat on WhatsApp');
      el.innerHTML = '<span class="whatsapp-float__icon" aria-hidden="true">💬</span><span class="whatsapp-float__label">Chat with us</span>';
      document.body.appendChild(el);
    }
    var whatsappHref = buildWhatsAppUrl(
      clinic.whatsapp || '',
      'Hello ' + (doc.name || '') + ', I would like to book an appointment.'
    );

    if (el) {
      el.href = whatsappHref;

      // Show label on desktop
      var label = el.querySelector('.whatsapp-float__label');
      if (label && window.innerWidth > 768) {
        label.style.display = 'inline';
      }
    }

    var heroWa = document.getElementById('hero-whatsapp');
    if (heroWa) {
      heroWa.href = whatsappHref;
    }

    var navWa = document.getElementById('navbar-whatsapp');
    if (navWa) {
      navWa.href = whatsappHref;
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
      '.section, .service-card, .why-card, .testimonial-card, .expertise-card, .case-archive-card'
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.classList.add('reveal-on-scroll');
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
