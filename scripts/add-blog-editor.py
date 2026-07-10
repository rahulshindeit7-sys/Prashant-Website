import sys

f = '/var/www/smzentrix.info/cms/public/js/editor.js'
c = open(f).read()

# 1. Add buildBlogTab to buildAllTabs function
if 'buildBlogTab' not in c:
    old_call = '  buildPreviewTab();'
    new_call = '  buildBlogTab(config);\n  buildPreviewTab();'
    c = c.replace(old_call, new_call, 1)

    # 2. Add the buildBlogTab function before the last export
    blog_fn = '''

/**
 * Build Blog tab - CRUD for blog posts
 */
function buildBlogTab(config) {
  const container = document.getElementById('blogForm');
  if (!container) return;

  if (!Array.isArray(config.blog_posts)) config.blog_posts = [];

  let html = '<div class="blog-manager">';

  if (config.blog_posts.length > 0) {
    config.blog_posts.forEach((post, idx) => {
      const statusBadge = post.published !== false
        ? '<span style="color:#388e3c;font-weight:bold;">Published</span>'
        : '<span style="color:#d32f2f;font-weight:bold;">Draft</span>';

      html += `
        <div class="blog-post-item" style="border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h3 style="margin:0;">${escapeHtml(post.title || 'Untitled Post')}</h3>
            ${statusBadge}
          </div>
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1;">
              <label>Title</label>
              <input type="text" data-field="blog_posts.${idx}.title" value="${escapeHtml(post.title || '')}" placeholder="Blog post title">
            </div>
            <div class="form-group">
              <label>Slug (URL-friendly)</label>
              <input type="text" data-field="blog_posts.${idx}.slug" value="${escapeHtml(post.slug || '')}" placeholder="my-blog-post">
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" data-field="blog_posts.${idx}.date" value="${escapeHtml(post.date || '')}">
            </div>
            <div class="form-group">
              <label>Author</label>
              <input type="text" data-field="blog_posts.${idx}.author" value="${escapeHtml(post.author || '')}" placeholder="Dr. Name">
            </div>
            <div class="form-group">
              <label>Tags (comma separated)</label>
              <input type="text" data-field="blog_posts.${idx}.tags" value="${escapeHtml(Array.isArray(post.tags) ? post.tags.join(', ') : '')}" placeholder="health, cancer, awareness">
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Summary (short description for card)</label>
              <textarea data-field="blog_posts.${idx}.summary" rows="2" placeholder="Brief summary for listing page...">${escapeHtml(post.summary || '')}</textarea>
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Content (full blog post)</label>
              <textarea data-field="blog_posts.${idx}.content" rows="10" placeholder="Full blog content... You can use HTML tags for formatting.">${escapeHtml(post.content || '')}</textarea>
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Image</label>
              <div style="display:flex;align-items:center;gap:10px;">
                ${post.image ? '<img src="' + post.image + '" alt="preview" style="width:80px;height:60px;object-fit:cover;border-radius:4px;border:1px solid #ddd;">' : ''}
                <input type="file" id="blog-img-${idx}" accept=".jpg,.jpeg,.png,.webp" style="display:none;" class="blog-img-input" data-index="${idx}">
                <button type="button" class="btn-upload-blog-img" data-index="${idx}" style="background:#1976d2;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;">${post.image ? 'Change Image' : 'Upload Image'}</button>
                <span id="blog-img-status-${idx}" style="font-size:12px;"></span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button type="button" class="btn-toggle-blog-publish" data-index="${idx}" style="background:${post.published !== false ? '#ff9800' : '#388e3c'};color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">
              ${post.published !== false ? '⏸ Unpublish' : '✅ Publish'}
            </button>
            <button type="button" class="btn-delete-blog" data-index="${idx}" style="background:#d32f2f;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">🗑 Delete</button>
          </div>
        </div>
      `;
    });
  } else {
    html += '<p style="color:#666;text-align:center;padding:2rem;">No blog posts yet. Click "Add Blog Post" to create one.</p>';
  }

  html += '<div style="margin-top:20px;">';
  html += '<button type="button" id="addBlogBtn" style="background:#388e3c;color:#fff;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;font-size:14px;">+ Add Blog Post</button>';
  html += '</div></div>';

  container.innerHTML = html;

  // Delete handlers
  document.querySelectorAll('.btn-delete-blog').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      if (confirm('Delete this blog post?')) {
        const state = window.__cmsState;
        if (state && Array.isArray(state.currentConfig.blog_posts)) {
          state.currentConfig.blog_posts.splice(idx, 1);
          buildBlogTab(state.currentConfig);
        }
      }
    });
  });

  // Toggle publish handlers
  document.querySelectorAll('.btn-toggle-blog-publish').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const state = window.__cmsState;
      if (state && Array.isArray(state.currentConfig.blog_posts)) {
        state.currentConfig.blog_posts[idx].published = !state.currentConfig.blog_posts[idx].published;
        buildBlogTab(state.currentConfig);
      }
    });
  });

  // Add new blog post
  const addBtn = document.getElementById('addBlogBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const state = window.__cmsState;
      if (state) {
        if (!Array.isArray(state.currentConfig.blog_posts)) state.currentConfig.blog_posts = [];
        const today = new Date().toISOString().split('T')[0];
        state.currentConfig.blog_posts.push({
          slug: '',
          title: '',
          summary: '',
          content: '',
          image: '',
          author: state.currentConfig.doctor?.name || '',
          date: today,
          tags: [],
          published: false
        });
        buildBlogTab(state.currentConfig);
      }
    });
  }

  // Image upload handlers
  document.querySelectorAll('.btn-upload-blog-img').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      document.getElementById('blog-img-' + idx).click();
    });
  });

  document.querySelectorAll('.blog-img-input').forEach(input => {
    input.addEventListener('change', async (e) => {
      const idx = parseInt(input.dataset.index);
      const file = e.target.files[0];
      if (!file) return;

      const statusEl = document.getElementById('blog-img-status-' + idx);
      if (statusEl) statusEl.textContent = 'Uploading...';

      try {
        const formData = new FormData();
        formData.append('image', file);
        const resp = await fetch('/api/uploads/image', {
          method: 'POST',
          body: formData
        });
        const data = await resp.json();
        if (data.ok && data.url) {
          const state = window.__cmsState;
          if (state && state.currentConfig.blog_posts[idx]) {
            state.currentConfig.blog_posts[idx].image = data.url;
            buildBlogTab(state.currentConfig);
          }
        } else {
          if (statusEl) statusEl.textContent = 'Upload failed';
        }
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Upload error';
      }
    });
  });
}

'''
    # Find the last function before export
    c += blog_fn

    open(f, 'w').write(c)
    print('BLOG_EDITOR_ADDED')
else:
    print('BLOG_EDITOR_ALREADY_EXISTS')
