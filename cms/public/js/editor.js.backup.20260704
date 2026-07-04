/**
 * Form Editor Builder
 * Creates form inputs for each tab based on config schema
 */

/**
 * Build all tab forms
 */
export function buildAllTabs(config) {
  buildHomeTab(config);
  buildAboutTab(config);
  buildContactTab(config);
  buildTreatmentsTab(config);
  buildExpertiseTab(config);
  buildTestimonialsTab(config);
  buildGalleryTab(config);
  buildSeoTab(config);
  buildPreviewTab();
}

/**
 * Build Home tab
 */
function buildHomeTab(config) {
  const html = `
    <form class="form-grid">
      ${inputField('doctor.name', 'Doctor Name', config.doctor?.name)}
      ${inputField('doctor.tagline', 'Tagline/Specialty', config.doctor?.tagline)}
      ${textareaField('doctor.hero_subtitle', 'Hero Subtitle', config.doctor?.hero_subtitle)}
      ${fileUploadField('doctor.hero_image', 'Hero Image', config.doctor?.hero_image)}
    </form>
  `;
  document.getElementById('homeForm').innerHTML = html;
  // Attach upload handlers
  attachUploadHandler('doctor.hero_image');
}

/**
 * Build About tab
 */
function buildAboutTab(config) {
  const html = `
    <form class="form-grid">
      ${inputField('doctor.degree', 'Degree/Qualification', config.doctor?.degree)}
      ${inputField('doctor.specialization', 'Specialization', config.doctor?.specialization)}
      ${inputField('doctor.experience', 'Years of Experience', config.doctor?.experience, 'number')}
      ${textareaField('doctor.about', 'About Doctor', config.doctor?.about)}
      ${fileUploadField('doctor.profile_image', 'Profile Photo', config.doctor?.profile_image)}
    </form>
  `;
  document.getElementById('aboutForm').innerHTML = html;
  // Attach upload handlers
  attachUploadHandler('doctor.profile_image');
}

/**
 * Build Contact tab
 */
function buildContactTab(config) {
  const html = `
    <form class="form-grid">
      ${inputField('clinic.address', 'Clinic Address', config.clinic?.address)}
      ${inputField('clinic.phone', 'Phone Number', config.clinic?.phone)}
      ${inputField('clinic.whatsapp', 'WhatsApp Number', config.clinic?.whatsapp)}
      ${textareaField('clinic.timings', 'Clinic Timings', config.clinic?.timings)}
    </form>
  `;
  document.getElementById('contactForm').innerHTML = html;
}

/**
 * Build Treatments tab
 */
function buildTreatmentsTab(config) {
  let html = '<div class="services-container">';
  
  if (config.services && config.services.length > 0) {
    config.services.forEach((service, idx) => {
      html += `
        <div class="service-item">
          <h3>${service.name || 'Service'}</h3>
          <input type="text" data-field="services.${idx}.name" value="${service.name || ''}" placeholder="Service Name">
          <textarea data-field="services.${idx}.description" placeholder="Description">${service.description || ''}</textarea>
        </div>
      `;
    });
  } else {
    html += '<p>No treatments configured.</p>';
  }

  html += '</div>';
  document.getElementById('treatmentsForm').innerHTML = html;
}

/**
 * Build Expertise tab
 */
function buildExpertiseTab(config) {
  let html = '<div class="expertise-container">';
  
  if (config.expertise_items && config.expertise_items.length > 0) {
    config.expertise_items.forEach((item, idx) => {
      html += `
        <div class="expertise-item">
          <h3>${item.title || 'Expertise'}</h3>
          <input type="text" data-field="expertise_items.${idx}.title" value="${item.title || ''}" placeholder="Title">
          <textarea data-field="expertise_items.${idx}.description" placeholder="Description">${item.description || ''}</textarea>
          <label>
            <input type="checkbox" data-field="expertise_items.${idx}.active" ${item.active ? 'checked' : ''}>
            Active
          </label>
        </div>
      `;
    });
  } else {
    html += '<p>No expertise items configured.</p>';
  }

  html += '</div>';
  document.getElementById('expertiseForm').innerHTML = html;
}

/**
 * Build Testimonials tab
 */
function buildTestimonialsTab(config) {
  let html = '<div class="testimonials-container">';
  
  if (config.testimonials && config.testimonials.length > 0) {
    config.testimonials.forEach((testimonial, idx) => {
      html += `
        <div class="testimonial-item">
          <h3>${testimonial.patient_name || 'Testimonial'}</h3>
          <input type="text" data-field="testimonials.${idx}.patient_name" value="${testimonial.patient_name || ''}" placeholder="Patient Name">
          <input type="text" data-field="testimonials.${idx}.treatment" value="${testimonial.treatment || ''}" placeholder="Treatment">
          <input type="number" data-field="testimonials.${idx}.rating" value="${testimonial.rating || 5}" min="1" max="5" placeholder="Rating">
          <textarea data-field="testimonials.${idx}.review_text" placeholder="Review">${testimonial.review_text || ''}</textarea>
          <label>
            <input type="checkbox" data-field="testimonials.${idx}.active" ${testimonial.active ? 'checked' : ''}>
            Active
          </label>
        </div>
      `;
    });
  } else {
    html += '<p>No testimonials configured.</p>';
  }

  html += '</div>';
  document.getElementById('testimonialsForm').innerHTML = html;
}

/**
 * Build Gallery tab
 */
function buildGalleryTab(config) {
  let html = '<div class="gallery-container">';
  
  if (config.gallery && config.gallery.length > 0) {
    config.gallery.forEach((image, idx) => {
      html += `
        <div class="gallery-item">
          <img src="${image.url}" alt="${image.title || 'Gallery'}" style="max-width: 100px; max-height: 100px;">
          <input type="text" data-field="gallery.${idx}.title" value="${image.title || ''}" placeholder="Image Title">
          <input type="text" data-field="gallery.${idx}.url" value="${image.url || ''}" placeholder="Image URL">
        </div>
      `;
    });
  } else {
    html += '<p>No gallery images configured.</p>';
  }

  html += '<div style="margin-top: 20px;" class="add-gallery-section">';
  html += '<h3>Add New Gallery Image</h3>';
  html += fileUploadField('gallery.new_upload', 'Upload Image');
  html += '</div>';
  html += '</div>';
  document.getElementById('galleryForm').innerHTML = html;
  // Attach upload handlers
  attachUploadHandler('gallery.new_upload');
}

/**
 * Build SEO tab
 */
function buildSeoTab(config) {
  const html = `
    <form class="form-grid">
      ${inputField('seo.title', 'Page Title', config.seo?.title)}
      ${textareaField('seo.description', 'Meta Description', config.seo?.description)}
      ${inputField('seo.og_image', 'OG Image URL', config.seo?.og_image)}
    </form>
  `;
  document.getElementById('seoForm').innerHTML = html;
}

/**
 * Build Preview & Publish tab
 */
function buildPreviewTab() {
  const html = `
    <div class="preview-panel">
      <h2>Preview & Publish Workflow</h2>
      <ol>
        <li><strong>Save Draft</strong> — Save your changes to draft (live site unchanged)</li>
        <li><strong>Preview</strong> — Click to see how changes look (requires active session)</li>
        <li><strong>Publish</strong> — Make changes live (creates automatic backup)</li>
      </ol>
      <p>✅ Backups are created automatically before each publish.</p>
      <p>⚠️ All changes are atomic — no partial updates.</p>
      
      <h3 style="margin-top: 30px;">Version History & Rollback</h3>
      <div id="backupsList"></div>
    </div>
  `;
  document.getElementById('previewPanel').innerHTML = html;
  // Load backups will be called after DOM is ready
}

/**
 * Helper: Input field
 */
function inputField(name, label, value = '', type = 'text') {
  const val = value || '';
  return `
    <div class="form-group">
      <label for="${name}">${label}</label>
      <input type="${type}" id="${name}" data-field="${name}" value="${escapeHtml(val)}" placeholder="${label}">
    </div>
  `;
}

/**
 * Helper: Textarea field
 */
function textareaField(name, label, value = '') {
  const val = value || '';
  return `
    <div class="form-group">
      <label for="${name}">${label}</label>
      <textarea id="${name}" data-field="${name}" placeholder="${label}" rows="4">${escapeHtml(val)}</textarea>
    </div>
  `;
}

/**
 * Helper: File upload field
 */
function fileUploadField(name, label, currentUrl = '') {
  return `
    <div class="form-group upload-group">
      <label for="${name}-input">${label}</label>
      <div class="upload-wrapper">
        <input type="file" id="${name}-input" accept=".jpg,.jpeg,.png,.webp" data-field="${name}" style="display: none;">
        <button type="button" class="btn-upload" data-upload-field="${name}">Choose File</button>
        <span class="upload-status" id="${name}-status"></span>
      </div>
      ${currentUrl ? `<small>Current: <a href="${currentUrl}" target="_blank">${currentUrl.substring(currentUrl.lastIndexOf('/') + 1)}</a></small>` : ''}
    </div>
  `;
}

/**
 * Attach upload handler to file input
 */
function attachUploadHandler(fieldName) {
  const uploadBtn = document.querySelector(`[data-upload-field="${fieldName}"]`);
  const fileInput = document.getElementById(`${fieldName}-input`);
  const statusSpan = document.getElementById(`${fieldName}-status`);

  if (!uploadBtn || !fileInput) return;

  // Click button to open file picker
  uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      statusSpan.textContent = '❌ File too large (max 5MB)';
      statusSpan.style.color = '#d32f2f';
      setTimeout(() => { statusSpan.textContent = ''; }, 3000);
      return;
    }

    // Show uploading status
    statusSpan.textContent = '⏳ Uploading...';
    statusSpan.style.color = '#ffa500';
    uploadBtn.disabled = true;

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        statusSpan.textContent = `❌ ${error.message || 'Upload failed'}`;
        statusSpan.style.color = '#d32f2f';
        return;
      }

      const result = await response.json();
      if (result.ok && result.url) {
        // Find the input field and set the URL
        const urlField = document.querySelector(`[data-field="${fieldName}"]`);
        if (urlField && fieldName.includes('new_upload')) {
          // For gallery new upload, just show success
          statusSpan.textContent = `✅ Uploaded: ${result.url}`;
          statusSpan.style.color = '#4caf50';
          // Store URL in a data attribute for later retrieval
          fileInput.dataset.uploadedUrl = result.url;
        } else if (urlField) {
          // For other fields, set the URL directly
          urlField.value = result.url;
          urlField.dataset.field = fieldName;
          statusSpan.textContent = '✅ Uploaded successfully';
          statusSpan.style.color = '#4caf50';
        }
        setTimeout(() => { statusSpan.textContent = ''; }, 3000);
      } else {
        statusSpan.textContent = '❌ Upload failed';
        statusSpan.style.color = '#d32f2f';
      }
    } catch (err) {
      statusSpan.textContent = '❌ Upload error';
      statusSpan.style.color = '#d32f2f';
      console.error('Upload error:', err);
    } finally {
      uploadBtn.disabled = false;
      fileInput.value = ''; // Reset input
    }
  });
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

export { buildAllTabs };
