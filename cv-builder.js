/**
 * Opportune CV Builder — Production-Ready Modular Application
 * =============================================================
 * ES6 Module Pattern | LocalStorage | Live Preview | PDF Export | QR Code
 * Glassmorphism UI | Dark/Light Mode | Drag & Drop | Form Validation
 * 
 * @version 2.0.0
 * @author Opportune Team
 */

const CVBuilder = (() => {
  'use strict';

  /* =================================================================
     CONSTANTS & CONFIG
     ================================================================= */
  const STORAGE_KEY = 'opportune_cv_data';
  const THEME_KEY = 'opportune_cv_theme';
  const LAYOUT_KEY = 'opportune_cv_layout';
  const AUTOSAVE_DELAY = 1500; // ms
  const TOAST_DURATION = 3500; // ms
  const API_BASE = 'http://localhost:5000/api';

  const SUGGESTED_SKILLS = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Django', 'Laravel',
    'Spring Boot', 'ASP.NET', 'Express.js', 'Next.js', 'Nuxt.js',
    'HTML', 'CSS', 'Sass', 'Less', 'Tailwind CSS', 'Bootstrap',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'GitHub Actions',
    'REST API', 'GraphQL', 'WebSocket', 'gRPC', 'Microservices',
    'Linux', 'Bash', 'PowerShell', 'Nginx', 'Apache',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch',
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Trello', 'Confluence',
    'Communication', 'Teamwork', 'Leadership', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity',
    'Project Management', 'Product Management', 'Data Analysis',
    'SEO', 'Google Analytics', 'Content Marketing', 'Social Media',
    'Salesforce', 'HubSpot', 'CRM', 'ERP', 'SAP',
    'Network Security', 'Penetration Testing', 'Ethical Hacking',
    'Arabic', 'French', 'English', 'Spanish', 'German', 'Mandarin'
  ];

  /* =================================================================
     STATE
     ================================================================= */
  let autoSaveTimer = null;
  let currentLayout = localStorage.getItem(LAYOUT_KEY) || 'two-column';
  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

  /* =================================================================
     STORAGE MODULE — LocalStorage Persistence
     ================================================================= */
  const Storage = {
    /** Save entire CV state to localStorage */
    save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn('Failed to save CV data:', e);
        return false;
      }
    },

    /** Load CV state from localStorage */
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn('Failed to load CV data:', e);
        return null;
      }
    },

    /** Clear all CV data */
    clear() {
      localStorage.removeItem(STORAGE_KEY);
    },

    /** Export data as JSON file download */
    exportJSON(data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opportune-cv-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  /* =================================================================
     VALIDATION MODULE — Field Validation
     ================================================================= */
  const Validation = {
    rules: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      url: /^https?:\/\/.+/i,
      phone: /^[\+\d\s\-\(\)]{7,20}$/,
      required: (val) => val && val.trim().length > 0
    },

    /** Validate a single field value */
    validate(value, rules = []) {
      const errors = [];
      for (const rule of rules) {
        if (rule === 'required' && !this.rules.required(value)) {
          errors.push('This field is required');
        }
        if (rule === 'email' && value && !this.rules.email.test(value)) {
          errors.push('Please enter a valid email address');
        }
        if (rule === 'url' && value && !this.rules.url.test(value)) {
          errors.push('Please enter a valid URL (must start with http:// or https://)');
        }
        if (rule === 'phone' && value && !this.rules.phone.test(value)) {
          errors.push('Please enter a valid phone number');
        }
      }
      return errors;
    },

    /** Show validation error on a field */
    showError(inputId, message) {
      const input = document.getElementById(inputId);
      const errorEl = document.getElementById(`${inputId}-error`);
      if (input) input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    },

    /** Clear validation error from a field */
    clearError(inputId) {
      const input = document.getElementById(inputId);
      const errorEl = document.getElementById(`${inputId}-error`);
      if (input) input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    },

    /** Validate all required personal info fields */
    validatePersonalInfo() {
      const fields = [
        { id: 'firstName', rules: ['required'] },
        { id: 'lastName', rules: ['required'] },
        { id: 'jobTitle', rules: ['required'] },
        { id: 'cvEmail', rules: ['required', 'email'] },
        { id: 'cvPhone', rules: ['phone'] },
        { id: 'cvLinkedin', rules: ['url'] },
        { id: 'cvGithub', rules: ['url'] },
        { id: 'cvWebsite', rules: ['url'] },
        { id: 'cvPortfolio', rules: ['url'] }
      ];

      let isValid = true;
      fields.forEach(({ id, rules }) => {
        const input = document.getElementById(id);
        if (!input) return;
        const errors = this.validate(input.value, rules);
        if (errors.length > 0) {
          this.showError(id, errors[0]);
          isValid = false;
        } else {
          this.clearError(id);
        }
      });
      return isValid;
    }
  };

  /* =================================================================
     UI MODULE — Toast Notifications & Modals
     ================================================================= */
  const UI = {
    toastEl: document.getElementById('toast'),
    modalOverlay: document.getElementById('confirmModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalDesc: document.getElementById('modalDesc'),
    modalIcon: document.getElementById('modalIcon'),
    modalConfirm: document.getElementById('modalConfirm'),
    modalCancel: document.getElementById('modalCancel'),
    toastTimer: null,

    /** Show toast notification */
    showToast(message, type = 'info') {
      if (this.toastTimer) clearTimeout(this.toastTimer);

      this.toastEl.className = `cvb-toast ${type}`;
      this.toastEl.innerHTML = this._getToastIcon(type) + ' ' + this._escapeHtml(message);
      this.toastEl.classList.add('show');

      this.toastTimer = setTimeout(() => {
        this.toastEl.classList.remove('show');
      }, TOAST_DURATION);
    },

    /** Show confirmation modal */
    showModal({ title, description, icon = '\u{1F5D1}', confirmText = 'Delete', confirmClass = 'cvb-btn-danger', onConfirm, onCancel }) {
      this.modalTitle.textContent = title;
      this.modalDesc.textContent = description;
      this.modalIcon.textContent = icon;
      this.modalConfirm.textContent = confirmText;
      this.modalConfirm.className = `cvb-btn ${confirmClass}`;
      this.modalOverlay.classList.add('active');

      const handleConfirm = () => {
        this._cleanupModal(handleConfirm, handleCancel);
        if (onConfirm) onConfirm();
      };

      const handleCancel = () => {
        this._cleanupModal(handleConfirm, handleCancel);
        if (onCancel) onCancel();
      };

      this.modalConfirm.onclick = handleConfirm;
      this.modalCancel.onclick = handleCancel;
      this.modalOverlay.onclick = (e) => {
        if (e.target === this.modalOverlay) handleCancel();
      };

      // Escape key to cancel
      const handleKey = (e) => {
        if (e.key === 'Escape') {
          handleCancel();
          document.removeEventListener('keydown', handleKey);
        }
      };
      document.addEventListener('keydown', handleKey);
    },

    _cleanupModal(confirmFn, cancelFn) {
      this.modalOverlay.classList.remove('active');
      this.modalConfirm.onclick = null;
      this.modalCancel.onclick = null;
      this.modalOverlay.onclick = null;
    },

    _getToastIcon(type) {
      const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-exclamation"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
      };
      return icons[type] || icons.info;
    },

    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /** Update save indicator status */
    setSaveIndicator(status) {
      const indicator = document.getElementById('saveIndicator');
      const spinner = document.getElementById('saveSpinner');
      const check = document.getElementById('saveCheck');
      const text = document.getElementById('saveText');

      indicator.className = 'cvb-save-indicator ' + status;

      if (status === 'saving') {
        spinner.style.display = 'block';
        check.style.display = 'none';
        text.textContent = 'Saving...';
      } else if (status === 'saved') {
        spinner.style.display = 'none';
        check.style.display = 'block';
        text.textContent = 'Saved';
        setTimeout(() => {
          indicator.className = 'cvb-save-indicator';
          check.style.display = 'none';
          text.textContent = 'Auto-save enabled';
        }, 2000);
      }
    }
  };

  /* =================================================================
     THEME MODULE — Dark/Light Mode Toggle
     ================================================================= */
  const Theme = {
    init() {
      // Apply saved theme
      document.documentElement.setAttribute('data-theme', currentTheme);
      this._updateIcon();

      document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
    },

    toggle() {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem(THEME_KEY, currentTheme);
      this._updateIcon();
      UI.showToast(`${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} mode activated`, 'info');
    },

    _updateIcon() {
      const btn = document.getElementById('themeToggle');
      const icon = btn.querySelector('i');
      icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      btn.title = `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`;
    }
  };

  /* =================================================================
     LAYOUT MODULE — Two-Column / Classic Toggle
     ================================================================= */
  const Layout = {
    init() {
      const cvPreview = document.getElementById('cvPreview');
      const buttons = document.querySelectorAll('.cvb-layout-toggle button');

      // Apply saved layout
      if (currentLayout === 'classic') {
        cvPreview.classList.add('classic');
      }
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.layout === currentLayout);
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const layout = btn.dataset.layout;
          currentLayout = layout;
          localStorage.setItem(LAYOUT_KEY, layout);

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (layout === 'classic') {
            cvPreview.classList.add('classic');
          } else {
            cvPreview.classList.remove('classic');
          }

          UI.showToast(`Layout changed to ${layout === 'classic' ? 'Classic' : 'Two-Column'}`, 'info');
        });
      });
    }
  };

  /* =================================================================
     TAGS MODULE — Skills, Languages, Interests, Hobbies
     ================================================================= */
  const Tags = {
    /** Tag data store: { technicalSkills: [...], softSkills: [...], ... } */
    data: {
      technicalSkills: [],
      softSkills: [],
      skills: [],
      languages: [],
      interests: [],
      hobbies: []
    },

    /** Mapping of input IDs to their container and preview IDs */
    config: {
      technicalSkillsInput: { tagsContainer: 'technicalSkillsTags', previewEl: 'previewTechnicalSkills', section: 'previewTechnicalSkillsSection' },
      softSkillsInput:      { tagsContainer: 'softSkillsTags',      previewEl: 'previewSoftSkills',      section: 'previewSoftSkillsSection' },
      skillsInput:          { tagsContainer: 'skillsTags',          previewEl: 'previewSkills',          section: 'previewSkillsSection' },
      languagesInput:       { tagsContainer: 'languagesTags',       previewEl: 'previewLanguages',       section: 'previewLanguagesSection' },
      interestsInput:       { tagsContainer: 'interestsTags',       previewEl: 'previewInterests',       section: 'previewInterestsSection' },
      hobbiesInput:         { tagsContainer: 'hobbiesTags',         previewEl: 'previewHobbies',         section: 'previewHobbiesSection' }
    },

    init() {
      Object.keys(this.config).forEach(inputId => {
        this._setupInput(inputId);
      });
    },

    _setupInput(inputId) {
      const input = document.getElementById(inputId);
      const container = document.getElementById(this.config[inputId].tagsContainer);
      if (!input || !container) return;

      // Handle Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const value = input.value.trim();
          if (value) {
            this.addTag(inputId, value);
            input.value = '';
          }
        }
        if (e.key === 'Backspace' && input.value === '') {
          // Remove last tag on empty backspace
          const key = inputId.replace('Input', '');
          if (this.data[key].length > 0) {
            this.removeTag(inputId, this.data[key][this.data[key].length - 1]);
          }
        }
      });

      // Handle input for suggestions
      input.addEventListener('input', (e) => {
        this._showSuggestions(inputId, e.target.value.trim().toLowerCase());
      });

      // Blur to hide suggestions
      input.addEventListener('blur', () => {
        setTimeout(() => this._hideSuggestions(inputId), 200);
      });
    },

    _getKey(inputId) {
      return inputId.replace('Input', '');
    },

    addTag(inputId, value) {
      const key = this._getKey(inputId);
      if (!this.data[key]) this.data[key] = [];

      // Prevent duplicates (case-insensitive)
      if (this.data[key].some(t => t.toLowerCase() === value.toLowerCase())) {
        UI.showToast(`"${value}" is already added`, 'warning');
        return;
      }

      this.data[key].push(value);
      this._render(inputId);
      this._updatePreview(inputId);
      Preview.triggerAutoSave();
    },

    removeTag(inputId, value) {
      const key = this._getKey(inputId);
      if (!this.data[key]) return;

      this.data[key] = this.data[key].filter(t => t.toLowerCase() !== value.toLowerCase());
      this._render(inputId);
      this._updatePreview(inputId);
      Preview.triggerAutoSave();
    },

    setTags(inputId, tags) {
      const key = this._getKey(inputId);
      this.data[key] = Array.isArray(tags) ? [...tags] : [];
      this._render(inputId);
      this._updatePreview(inputId);
    },

    _render(inputId) {
      const key = this._getKey(inputId);
      const container = document.getElementById(this.config[inputId].tagsContainer);
      if (!container) return;

      container.innerHTML = '';
      (this.data[key] || []).forEach(tag => {
        const el = document.createElement('span');
        el.className = 'cvb-tag';
        el.innerHTML = `${this._escapeHtml(tag)} <span class="cvb-tag-remove" role="button" tabindex="0" aria-label="Remove ${this._escapeHtml(tag)}">\u2715</span>`;

        el.querySelector('.cvb-tag-remove').addEventListener('click', () => this.removeTag(inputId, tag));
        container.appendChild(el);
      });
    },

    _updatePreview(inputId) {
      const key = this._getKey(inputId);
      const config = this.config[inputId];
      const previewEl = document.getElementById(config.previewEl);
      const sectionEl = document.getElementById(config.section);
      if (!previewEl || !sectionEl) return;

      const tags = this.data[key] || [];
      if (tags.length === 0) {
        previewEl.innerHTML = '';
        sectionEl.style.display = 'none';
        return;
      }

      previewEl.innerHTML = tags.map(t => `<span>${this._escapeHtml(t)}</span>`).join('');
      sectionEl.style.display = '';
    },

    _showSuggestions(inputId, query) {
      if (!query || query.length < 1) return;

      const key = this._getKey(inputId);
      const existing = this.data[key] || [];

      const matches = SUGGESTED_SKILLS.filter(s => 
        s.toLowerCase().includes(query) && 
        !existing.some(e => e.toLowerCase() === s.toLowerCase())
      ).slice(0, 5);

      // For now, we don't show a dropdown but could add one later
      // The Enter key handles adding custom tags
    },

    _hideSuggestions(inputId) {
      // Placeholder for future suggestion dropdown
    },

    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /** Get all tag data for export */
    getAllData() {
      return { ...this.data };
    },

    /** Set all tag data from imported state */
    setAllData(data) {
      if (!data) return;
      Object.keys(this.config).forEach(inputId => {
        const key = this._getKey(inputId);
        if (data[key]) {
          this.data[key] = [...data[key]];
          this._render(inputId);
          this._updatePreview(inputId);
        }
      });
    }
  };

  /* =================================================================
     PHOTO MODULE — Drag & Drop Profile Picture
     ================================================================= */
  const Photo = {
    currentPhoto: null,

    init() {
      const dropZone = document.getElementById('photoDropZone');
      const fileInput = document.getElementById('photoInput');
      if (!dropZone || !fileInput) return;

      // Click to upload
      dropZone.addEventListener('click', (e) => {
        if (e.target !== fileInput) fileInput.click();
      });

      // Keyboard accessibility
      dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      });

      // File selection
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this._processFile(e.target.files[0]);
        }
      });

      // Drag & Drop
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
          this._processFile(files[0]);
        } else {
          UI.showToast('Please drop a valid image file', 'error');
        }
      });
    },

    _processFile(file) {
      if (!file.type.startsWith('image/')) {
        UI.showToast('Please select a valid image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        UI.showToast('Image must be less than 5MB', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentPhoto = e.target.result;
        this._render();
        Preview.triggerAutoSave();
        UI.showToast('Photo uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    },

    _render() {
      const previewBox = document.getElementById('photoPreview');
      const resumePhoto = document.getElementById('previewPhoto');

      if (this.currentPhoto) {
        previewBox.innerHTML = `<img src="${this.currentPhoto}" alt="Profile photo">`;
        if (resumePhoto) resumePhoto.innerHTML = `<img src="${this.currentPhoto}" alt="Profile photo">`;
      } else {
        previewBox.innerHTML = '<i class="fa-solid fa-user"></i>';
        if (resumePhoto) resumePhoto.innerHTML = '<i class="fa-solid fa-user"></i>';
      }
    },

    /** Set photo from base64 data (restore) */
    setPhoto(base64) {
      this.currentPhoto = base64 || null;
      this._render();
    },

    getPhoto() {
      return this.currentPhoto;
    }
  };

  /* =================================================================
     REPEATER MODULE — Dynamic Section Items (Education, Experience, etc.)
     ================================================================= */
  const Repeater = {
    /** Registry of repeater configurations */
    registry: {
      education:    { list: 'educationList',    template: 'tpl-education',    preview: 'previewEducation',    section: 'previewEducationSection',    empty: 'educationEmpty' },
      experience:   { list: 'experienceList',   template: 'tpl-experience',   preview: 'previewExperience',   section: 'previewExperienceSection',   empty: 'experienceEmpty' },
      volunteer:    { list: 'volunteerList',    template: 'tpl-volunteer',    preview: 'previewVolunteer',    section: 'previewVolunteerSection',    empty: 'volunteerEmpty' },
      project:      { list: 'projectsList',     template: 'tpl-project',      preview: 'previewProjects',     section: 'previewProjectsSection',     empty: 'projectsEmpty' },
      certificate:  { list: 'certificatesList', template: 'tpl-certificate',  preview: 'previewCertificates', section: 'previewCertificatesSection', empty: 'certificatesEmpty' },
      publication:  { list: 'publicationsList', template: 'tpl-publication',  preview: 'previewPublications', section: 'previewPublicationsSection', empty: 'publicationsEmpty' },
      award:        { list: 'awardsList',       template: 'tpl-award',        preview: 'previewAwards',       section: 'previewAwardsSection',       empty: 'awardsEmpty' },
      achievement:  { list: 'achievementsList', template: 'tpl-achievement',  preview: 'previewAchievements', section: 'previewAchievementsSection', empty: 'achievementsEmpty' },
      reference:    { list: 'referencesList',   template: 'tpl-reference',    preview: 'previewReferences',   section: 'previewReferencesSection',   empty: 'referencesEmpty' },
      customSection:{ list: 'customSectionsList', template: 'tpl-custom-section', preview: 'previewCustomSections', section: null, empty: 'customEmpty' }
    },

    /** Live data store for each type */
    data: {},

    init() {
      // Initialize empty arrays for each type
      Object.keys(this.registry).forEach(type => {
        this.data[type] = [];
      });

      // Wire up add buttons
      Object.keys(this.registry).forEach(type => {
        const btnId = type === 'customSection' ? 'addCustomSectionBtn' : `add${this._capitalize(type)}Btn`;
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener('click', () => this.addItem(type));
        }
      });
    },

    _capitalize(str) {
      // Handle special cases
      if (str === 'customSection') return 'CustomSection';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /** Add a new item to a repeater section */
    addItem(type, existingData = null) {
      const config = this.registry[type];
      if (!config) return;

      const listEl = document.getElementById(config.list);
      const template = document.getElementById(config.template);
      if (!listEl || !template) return;

      // Hide empty state
      const emptyEl = document.getElementById(config.empty);
      if (emptyEl) emptyEl.style.display = 'none';

      // Clone template
      const clone = template.content.cloneNode(true);
      const itemEl = clone.querySelector('.cvb-repeater-item');
      const index = this.data[type].length;
      itemEl.dataset.index = index;

      // Populate with existing data if restoring
      if (existingData) {
        Object.keys(existingData).forEach(key => {
          const field = itemEl.querySelector(`[data-field="${key}"]`);
          if (field && existingData[key]) {
            field.value = existingData[key];
          }
        });
      }

      // Wire up remove button
      const removeBtn = itemEl.querySelector('.cvb-remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          this.removeItem(type, itemEl);
        });
      }

      // Wire up live preview on all inputs
      itemEl.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
          this._syncPreview(type);
          Preview.triggerAutoSave();
        });
      });

      listEl.appendChild(itemEl);

      // Add empty data object
      this.data[type].push(existingData || {});

      // Sync preview
      this._syncPreview(type);

      // Scroll the new item into view
      setTimeout(() => {
        itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    },

    /** Remove an item from a repeater section */
    removeItem(type, itemEl) {
      const config = this.registry[type];
      if (!config) return;

      const index = parseInt(itemEl.dataset.index);

      // Animate removal
      itemEl.style.transition = 'all 300ms ease';
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateX(-20px)';

      setTimeout(() => {
        itemEl.remove();

        // Re-index remaining items
        const listEl = document.getElementById(config.list);
        const items = listEl.querySelectorAll('.cvb-repeater-item');
        items.forEach((item, i) => { item.dataset.index = i; });

        // Update data
        this.data[type].splice(index, 1);

        // Show empty state if no items
        if (items.length === 0) {
          const emptyEl = document.getElementById(config.empty);
          if (emptyEl) emptyEl.style.display = '';
        }

        this._syncPreview(type);
        Preview.triggerAutoSave();
      }, 300);
    },

    /** Extract data from all inputs in a repeater item */
    _extractItemData(itemEl) {
      const data = {};
      itemEl.querySelectorAll('[data-field]').forEach(field => {
        data[field.dataset.field] = field.value.trim();
      });
      return data;
    },

    /** Sync preview section from current data */
    _syncPreview(type) {
      const config = this.registry[type];
      if (!config) return;

      const listEl = document.getElementById(config.list);
      const previewEl = document.getElementById(config.preview);
      const sectionEl = config.section ? document.getElementById(config.section) : null;
      if (!listEl || !previewEl) return;

      // Extract all items data
      const items = listEl.querySelectorAll('.cvb-repeater-item');
      const allData = Array.from(items).map(item => this._extractItemData(item));
      this.data[type] = allData;

      // Update preview
      const hasData = allData.length > 0 && allData.some(d => Object.values(d).some(v => v));

      if (!hasData) {
        previewEl.innerHTML = '';
        if (sectionEl) sectionEl.style.display = 'none';
        return;
      }

      if (sectionEl) sectionEl.style.display = '';
      previewEl.innerHTML = allData.map((data, i) => this._renderPreviewEntry(type, data)).join('');
    },

    /** Render a single preview entry based on type */
    _renderPreviewEntry(type, data) {
      switch (type) {
        case 'education':
          return this._eduEntry(data);
        case 'experience':
          return this._expEntry(data);
        case 'volunteer':
          return this._volEntry(data);
        case 'project':
          return this._projEntry(data);
        case 'certificate':
          return this._certEntry(data);
        case 'publication':
          return this._pubEntry(data);
        case 'award':
          return this._awardEntry(data);
        case 'achievement':
          return this._achEntry(data);
        case 'reference':
          return this._refEntry(data);
        case 'customSection':
          return this._customEntry(data);
        default:
          return '';
      }
    },

    _eduEntry(d) {
      if (!d.school && !d.degree) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.degree || 'Degree')}</p>
            <p class="cv-entry-subtitle">${this._e(d.school || '')}${d.field ? ' — ' + this._e(d.field) : ''}</p>
          </div>
          ${d.start || d.end ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.start || '')}${d.end ? ' – ' + this._e(d.end) : ''}</span>` : ''}
        </div>
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _expEntry(d) {
      if (!d.company && !d.position) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.position || 'Position')}</p>
            <p class="cv-entry-subtitle">${this._e(d.company || '')}</p>
          </div>
          ${d.start || d.end ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.start || '')}${d.end ? ' – ' + this._e(d.end) : ''}</span>` : ''}
        </div>
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _volEntry(d) {
      if (!d.organization && !d.role) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.role || 'Role')}</p>
            <p class="cv-entry-subtitle">${this._e(d.organization || '')}</p>
          </div>
          ${d.start || d.end ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.start || '')}${d.end ? ' – ' + this._e(d.end) : ''}</span>` : ''}
        </div>
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _projEntry(d) {
      if (!d.name) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.name)}</p>
          </div>
        </div>
        ${d.link ? `<p class="cv-entry-link"><i class="fa-solid fa-link"></i> ${this._e(d.link)}</p>` : ''}
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _certEntry(d) {
      if (!d.name && !d.issuer) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.name || 'Certificate')}</p>
            <p class="cv-entry-subtitle">${this._e(d.issuer || '')}</p>
          </div>
          ${d.date ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.date)}</span>` : ''}
        </div>
      </div>`;
    },

    _pubEntry(d) {
      if (!d.title) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.title)}</p>
            ${d.publisher ? `<p class="cv-entry-subtitle">${this._e(d.publisher)}</p>` : ''}
          </div>
          ${d.date ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.date)}</span>` : ''}
        </div>
        ${d.link ? `<p class="cv-entry-link"><i class="fa-solid fa-link"></i> ${this._e(d.link)}</p>` : ''}
      </div>`;
    },

    _awardEntry(d) {
      if (!d.title && !d.organization) return '';
      return `<div class="cv-entry">
        <div class="cv-entry-header">
          <div>
            <p class="cv-entry-title">${this._e(d.title || 'Award')}</p>
            <p class="cv-entry-subtitle">${this._e(d.organization || '')}</p>
          </div>
          ${d.date ? `<span class="cv-entry-meta"><i class="fa-regular fa-calendar"></i> ${this._e(d.date)}</span>` : ''}
        </div>
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _achEntry(d) {
      if (!d.title) return '';
      return `<div class="cv-entry">
        <p class="cv-entry-title">${this._e(d.title)}</p>
        ${d.description ? `<p class="cv-entry-description">${this._e(d.description)}</p>` : ''}
      </div>`;
    },

    _refEntry(d) {
      if (!d.name) return '';
      return `<div class="cv-reference">
        <p class="cv-reference-name">${this._e(d.name)}${d.position ? ' — <span class="cv-reference-position">' + this._e(d.position) + '</span>' : ''}</p>
        ${d.email ? `<p class="cv-reference-contact"><i class="fa-solid fa-envelope"></i> ${this._e(d.email)}</p>` : ''}
        ${d.phone ? `<p class="cv-reference-contact"><i class="fa-solid fa-phone"></i> ${this._e(d.phone)}</p>` : ''}
      </div>`;
    },

    _customEntry(d) {
      if (!d.title && !d.content) return '';
      return `<div class="cv-custom-section">
        <h4>${this._e(d.title || 'Custom Section')}</h4>
        ${d.content ? `<p>${this._e(d.content)}</p>` : ''}
      </div>`;
    },

    _e(text) {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    },

    /** Get all repeater data for export */
    getAllData() {
      // Sync all previews to ensure data is current
      Object.keys(this.registry).forEach(type => this._syncPreview(type));
      const result = {};
      Object.keys(this.data).forEach(key => {
        result[key] = [...this.data[key]];
      });
      return result;
    },

    /** Restore all repeater data */
    setAllData(data) {
      if (!data) return;
      Object.keys(data).forEach(type => {
        const items = data[type];
        if (!Array.isArray(items)) return;
        items.forEach(itemData => {
          this.addItem(type, itemData);
        });
      });
    },

    /** Clear all repeater items */
    clearAll() {
      Object.keys(this.registry).forEach(type => {
        const config = this.registry[type];
        const listEl = document.getElementById(config.list);
        if (listEl) {
          // Remove all cvb-repeater-item elements but keep empty states
          listEl.querySelectorAll('.cvb-repeater-item').forEach(el => el.remove());
        }
        const emptyEl = document.getElementById(config.empty);
        if (emptyEl) emptyEl.style.display = '';
        this.data[type] = [];
      });
    }
  };

  /* =================================================================
     PREVIEW MODULE — Live Preview Synchronization
     ================================================================= */
  const Preview = {
    init() {
      this._bindPersonalFields();
      this._bindAboutFields();
      this._updateContacts();
      this._updateQRCode();
    },

    /** Bind personal information fields to preview */
    _bindPersonalFields() {
      const fields = [
        { id: 'firstName', target: 'previewName', transform: (v) => this._combineName() },
        { id: 'lastName', target: 'previewName', transform: (v) => this._combineName() },
        { id: 'jobTitle', target: 'previewTitle', defaultValue: 'Your Professional Title' },
      ];

      fields.forEach(({ id, target, transform, defaultValue }) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', () => {
          const targetEl = document.getElementById(target);
          if (targetEl) {
            if (transform) {
              targetEl.textContent = transform(input.value);
            } else {
              targetEl.textContent = input.value.trim() || defaultValue;
            }
          }
          // Also update contacts since they depend on multiple fields
          this._updateContacts();
          this.triggerAutoSave();
        });
      });

      // Bind contact fields
      ['cvEmail', 'cvPhone', 'cvCity', 'cvCountry', 'cvLinkedin', 'cvWebsite', 'cvPortfolio'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            this._updateContacts();
            this.triggerAutoSave();
          });
        }
      });

      // Bind personal details fields
      ['cvDob', 'cvNationality', 'cvMaritalStatus', 'cvDrivingLicense'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            this._updatePersonalDetails();
            this.triggerAutoSave();
          });
          input.addEventListener('change', () => {
            this._updatePersonalDetails();
            this.triggerAutoSave();
          });
        }
      });

      // QR code trigger on portfolio/linkedin change
      ['cvPortfolio', 'cvLinkedin', 'cvWebsite'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', () => {
            this._updateQRCode();
            this.triggerAutoSave();
          });
        }
      });
    },

    _combineName() {
      const first = document.getElementById('firstName')?.value.trim() || '';
      const last = document.getElementById('lastName')?.value.trim() || '';
      const full = `${first} ${last}`.trim();
      return full || 'Your Name';
    },

    /** Bind about and profile textareas */
    _bindAboutFields() {
      const about = document.getElementById('cvAbout');
      const profile = document.getElementById('cvProfile');

      if (about) {
        about.addEventListener('input', () => {
          const previewEl = document.getElementById('previewAbout');
          const sectionEl = document.getElementById('previewAboutSection');
          if (previewEl) previewEl.textContent = about.value;
          if (sectionEl) sectionEl.style.display = about.value.trim() ? '' : 'none';
          this.triggerAutoSave();
        });
      }

      if (profile) {
        profile.addEventListener('input', () => {
          const previewEl = document.getElementById('previewProfile');
          const sectionEl = document.getElementById('previewProfileSection');
          if (previewEl) previewEl.textContent = profile.value;
          if (sectionEl) sectionEl.style.display = profile.value.trim() ? '' : 'none';
          this.triggerAutoSave();
        });
      }
    },

    /** Update contact info row in preview header */
    _updateContacts() {
      const contactsEl = document.getElementById('previewContacts');
      if (!contactsEl) return;

      const email = document.getElementById('cvEmail')?.value.trim();
      const phone = document.getElementById('cvPhone')?.value.trim();
      const city = document.getElementById('cvCity')?.value.trim();
      const country = document.getElementById('cvCountry')?.value.trim();
      const linkedin = document.getElementById('cvLinkedin')?.value.trim();
      const website = document.getElementById('cvWebsite')?.value.trim();

      let html = '';
      if (email) html += `<span><i class="fa-solid fa-envelope"></i> ${this._e(email)}</span>`;
      if (phone) html += `<span><i class="fa-solid fa-phone"></i> ${this._e(phone)}</span>`;
      if (city || country) {
        const loc = [city, country].filter(Boolean).join(', ');
        html += `<span><i class="fa-solid fa-location-dot"></i> ${this._e(loc)}</span>`;
      }
      if (linkedin) html += `<span><i class="fa-brands fa-linkedin"></i> ${this._e(linkedin.replace(/^https?:\/\//, ''))}</span>`;
      if (website) html += `<span><i class="fa-solid fa-globe"></i> ${this._e(website.replace(/^https?:\/\//, ''))}</span>`;

      contactsEl.innerHTML = html;
    },

    /** Update personal details section in preview */
    _updatePersonalDetails() {
      const container = document.getElementById('previewPersonalDetails');
      const section = document.getElementById('previewPersonalDetailsSection');
      if (!container || !section) return;

      const dob = document.getElementById('cvDob')?.value;
      const nationality = document.getElementById('cvNationality')?.value.trim();
      const marital = document.getElementById('cvMaritalStatus')?.value;
      const license = document.getElementById('cvDrivingLicense')?.value.trim();

      let html = '';
      if (dob) html += `<div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">${this._e(this._formatDate(dob))}</span></div>`;
      if (nationality) html += `<div class="detail-row"><span class="detail-label">Nationality</span><span class="detail-value">${this._e(nationality)}</span></div>`;
      if (marital) html += `<div class="detail-row"><span class="detail-label">Marital Status</span><span class="detail-value">${this._e(marital)}</span></div>`;
      if (license) html += `<div class="detail-row"><span class="detail-label">Driving License</span><span class="detail-value">${this._e(license)}</span></div>`;

      container.innerHTML = html;
      section.style.display = html ? '' : 'none';
    },

    _formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d)) return dateStr;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    _updateQRCode() {
      const qrContainer = document.getElementById('previewQRCode');
      if (!qrContainer) return;

      const url = document.getElementById('cvPortfolio')?.value.trim() ||
                  document.getElementById('cvLinkedin')?.value.trim() ||
                  document.getElementById('cvWebsite')?.value.trim();

      if (!url) {
        qrContainer.innerHTML = '<i class="fa-solid fa-qrcode"></i>';
        return;
      }

      // Ensure URL has protocol
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;

      try {
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: fullUrl,
          width: 60,
          height: 60,
          colorDark: '#1a1a2e',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('QR Code generation failed:', e);
        qrContainer.innerHTML = '<i class="fa-solid fa-qrcode"></i>';
      }
    },

    /** Trigger auto-save after a debounce delay */
    triggerAutoSave() {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      UI.setSaveIndicator('saving');

      autoSaveTimer = setTimeout(() => {
        App.saveState();
        UI.setSaveIndicator('saved');
      }, AUTOSAVE_DELAY);
    },

    _e(text) {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    }
  };

  /* =================================================================
     PDF MODULE — Export to PDF using html2pdf
     ================================================================= */
  const PDF = {
    export() {
      const element = document.getElementById('cvPreview');
      if (!element) {
        UI.showToast('Could not find CV preview', 'error');
        return;
      }

      // Validate required fields first
      if (!Validation.validatePersonalInfo()) {
        UI.showToast('Please fill in required fields before downloading', 'warning');
        return;
      }

      const firstName = document.getElementById('firstName')?.value.trim() || 'CV';
      const lastName = document.getElementById('lastName')?.value.trim() || '';
      const fileName = `Opportune-CV-${firstName}-${lastName}.pdf`.replace(/\s+/g, '-');

      UI.showToast('Generating PDF...', 'info');

      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      // Add class for PDF-specific styling
      element.classList.add('pdf-export');

      html2pdf().set(opt).from(element).save()
        .then(() => {
          element.classList.remove('pdf-export');
          UI.showToast('PDF downloaded successfully!', 'success');
        })
        .catch(err => {
          element.classList.remove('pdf-export');
          console.error('PDF export error:', err);
          UI.showToast('Failed to generate PDF. Please try again.', 'error');
        });
    }
  };

  /* =================================================================
     SECTIONS MODULE — Collapse/Expand
     ================================================================= */
  const Sections = {
    init() {
      document.querySelectorAll('.cvb-card-head[data-toggle]').forEach(btn => {
        btn.addEventListener('click', () => this.toggle(btn));
      });
    },

    toggle(btn) {
      const card = btn.closest('.cvb-card');
      const isCollapsed = card.classList.contains('collapsed');

      if (isCollapsed) {
        card.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        card.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  };

  /* =================================================================
     APP MODULE — Main Application Controller
     ================================================================= */
  const App = {
    async init() {
      // Protection — accès réservé aux utilisateurs connectés
      // حماية — الدخول محجوز للمسجلين فقط
      const token = localStorage.getItem('opportune_token');
      if (!token) {
        window.location.href = 'login.html';
        return;
      }

      // Apply saved theme
      Theme.init();

      // Apply saved layout
      Layout.init();

      // Initialize all modules
      UI.setSaveIndicator('');
      Tags.init();
      Photo.init();
      Repeater.init();
      Preview.init();
      Sections.init();

      // Wire up main buttons
      this._bindButtons();

      // Pull latest CV from the server (if any) before restoring the form
      await this.syncFromServer();

      // Restore saved state
      this.restoreState();

      // Mark as ready
      console.log('\u{26A1} Opportune CV Builder initialized');
    },

    _bindButtons() {
      // Save button (manual)
      const saveBtns = [document.getElementById('saveCvBtn'), document.getElementById('saveCvBtnBottom')];
      saveBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => this.saveState(true));
      });

      // Delete CV button
      const deleteBtn = document.getElementById('deleteCvBtn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.confirmDelete());
      }

      // Download PDF button
      const pdfBtns = [document.getElementById('downloadPdfBtn'), document.getElementById('downloadPdfBtnBottom')];
      pdfBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => PDF.export());
      });

      // Clear validation errors on input
      document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            input.classList.remove('error');
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl) errorEl.textContent = '';
          }
        });
      });
    },

    /** Gather complete state from all modules */
    gatherState() {
      return {
        personal: {
          firstName: document.getElementById('firstName')?.value.trim() || '',
          lastName: document.getElementById('lastName')?.value.trim() || '',
          jobTitle: document.getElementById('jobTitle')?.value.trim() || '',
          currentPosition: document.getElementById('currentPosition')?.value.trim() || '',
          email: document.getElementById('cvEmail')?.value.trim() || '',
          phone: document.getElementById('cvPhone')?.value.trim() || '',
          city: document.getElementById('cvCity')?.value.trim() || '',
          country: document.getElementById('cvCountry')?.value.trim() || '',
          dob: document.getElementById('cvDob')?.value || '',
          nationality: document.getElementById('cvNationality')?.value.trim() || '',
          maritalStatus: document.getElementById('cvMaritalStatus')?.value || '',
          drivingLicense: document.getElementById('cvDrivingLicense')?.value.trim() || '',
          linkedin: document.getElementById('cvLinkedin')?.value.trim() || '',
          github: document.getElementById('cvGithub')?.value.trim() || '',
          website: document.getElementById('cvWebsite')?.value.trim() || '',
          portfolio: document.getElementById('cvPortfolio')?.value.trim() || ''
        },
        about: document.getElementById('cvAbout')?.value.trim() || '',
        profile: document.getElementById('cvProfile')?.value.trim() || '',
        tags: Tags.getAllData(),
        photo: Photo.getPhoto(),
        repeaters: Repeater.getAllData(),
        meta: {
          savedAt: new Date().toISOString(),
          version: '2.0.0'
        }
      };
    },

    /** Save state to localStorage, then sync to backend */
    saveState(manual = false) {
      const state = this.gatherState();
      const success = Storage.save(state);

      this.syncToServer(state, manual);

      if (manual) {
        if (success) {
          UI.showToast('CV saved successfully!', 'success');
        } else {
          UI.showToast('Failed to save CV', 'error');
        }
      }

      return success;
    },

    /** Push current CV state to the backend (silent unless manual save fails) */
    async syncToServer(state, manual) {
      const token = localStorage.getItem('opportune_token');
      if (!token) return;

      try {
        const response = await fetch(API_BASE + '/cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(state)
        });

        if (!response.ok && manual) {
          UI.showToast('Enregistré localement seulement (serveur indisponible)', 'error');
        }
      } catch (err) {
        console.warn('CV Builder: échec de synchronisation avec le serveur.', err);
        if (manual) {
          UI.showToast('Enregistré localement seulement (serveur indisponible)', 'error');
        }
      }
    },

    /** Pull the latest CV from the backend into localStorage before restoring the form */
    async syncFromServer() {
      const token = localStorage.getItem('opportune_token');
      if (!token) return;

      try {
        const response = await fetch(API_BASE + '/cv', {
          headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            Storage.save(result.data);
          }
        }
        // 404 = aucun CV enregistré côté serveur pour l'instant, on garde le localStorage tel quel
      } catch (err) {
        console.warn('CV Builder: impossible de récupérer le CV depuis le serveur, utilisation des données locales.', err);
      }
    },

    /** Restore state from localStorage */
    restoreState() {
      const state = Storage.load();
      if (!state) return;

      try {
        // Restore personal info
        if (state.personal) {
          const p = state.personal;
          const fields = {
            firstName: p.firstName, lastName: p.lastName, jobTitle: p.jobTitle,
            currentPosition: p.currentPosition, cvEmail: p.email, cvPhone: p.phone,
            cvCity: p.city, cvCountry: p.country, cvDob: p.dob,
            cvNationality: p.nationality, cvMaritalStatus: p.maritalStatus,
            cvDrivingLicense: p.drivingLicense, cvLinkedin: p.linkedin,
            cvGithub: p.github, cvWebsite: p.website, cvPortfolio: p.portfolio
          };
          Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value) el.value = value;
          });
        }

        // Restore about & profile
        if (state.about) {
          const about = document.getElementById('cvAbout');
          if (about) about.value = state.about;
        }
        if (state.profile) {
          const profile = document.getElementById('cvProfile');
          if (profile) profile.value = state.profile;
        }

        // Restore photo
        if (state.photo) Photo.setPhoto(state.photo);

        // Restore tags
        if (state.tags) Tags.setAllData(state.tags);

        // Restore repeater items
        if (state.repeaters) Repeater.setAllData(state.repeaters);

        // Trigger preview updates
        Preview._updateContacts();
        Preview._updatePersonalDetails();
        Preview._updateQRCode();

        // Trigger about/profile visibility
        const aboutVal = document.getElementById('cvAbout')?.value.trim();
        const profileVal = document.getElementById('cvProfile')?.value.trim();
        const aboutSection = document.getElementById('previewAboutSection');
        const profileSection = document.getElementById('previewProfileSection');
        if (aboutSection) aboutSection.style.display = aboutVal ? '' : 'none';
        if (profileSection) profileSection.style.display = profileVal ? '' : 'none';

        // Trigger name/title update
        const previewName = document.getElementById('previewName');
        const previewTitle = document.getElementById('previewTitle');
        if (previewName) previewName.textContent = Preview._combineName();
        if (previewTitle) previewTitle.textContent = document.getElementById('jobTitle')?.value.trim() || 'Your Professional Title';

        UI.showToast('Previous CV restored', 'info');
      } catch (e) {
        console.error('Failed to restore CV state:', e);
        UI.showToast('Could not restore previous CV', 'warning');
      }
    },

    /** Confirm and delete CV */
    confirmDelete() {
      UI.showModal({
        title: 'Delete CV?',
        description: 'This will permanently delete all your CV data. This action cannot be undone.',
        icon: '\u{1F5D1}',
        confirmText: 'Delete',
        confirmClass: 'cvb-btn-danger',
        onConfirm: () => {
          this.deleteCv();
        }
      });
    },

    async deleteCv() {
      // Clear all inputs
      document.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'file') return;
        input.value = '';
      });

      // Clear photo
      Photo.setPhoto(null);

      // Clear tags
      Tags.setAllData({});

      // Clear repeaters
      Repeater.clearAll();

      // Reset preview
      document.getElementById('previewName').textContent = 'Your Name';
      document.getElementById('previewTitle').textContent = 'Your Professional Title';
      document.getElementById('previewContacts').innerHTML = '';
      document.getElementById('previewQRCode').innerHTML = '<i class="fa-solid fa-qrcode"></i>';

      // Hide all optional sections
      ['previewAboutSection', 'previewProfileSection', 'previewPersonalDetailsSection',
       'previewTechnicalSkillsSection', 'previewSoftSkillsSection', 'previewSkillsSection',
       'previewLanguagesSection', 'previewInterestsSection', 'previewHobbiesSection',
       'previewExperienceSection', 'previewVolunteerSection', 'previewEducationSection',
       'previewProjectsSection', 'previewCertificatesSection', 'previewPublicationsSection',
       'previewAwardsSection', 'previewAchievementsSection', 'previewReferencesSection'
      ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      // Clear local storage
      Storage.clear();

      // Delete on the backend too — otherwise it comes back on next load
      const token = localStorage.getItem('opportune_token');
      if (token) {
        try {
          await fetch(API_BASE + '/cv', {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
          });
        } catch (err) {
          console.warn('CV Builder: échec de suppression côté serveur.', err);
        }
      }

      UI.showToast('CV deleted successfully', 'success');
    }
  };

  /* =================================================================
     PUBLIC API
     ================================================================= */
  return {
    init: () => App.init()
  };

})(); // End IIFE

/* ====================================================================
   INITIALIZATION
   ==================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  CVBuilder.init();
});