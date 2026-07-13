/* =============================================
   Attendre que la page soit complètement chargée
   انتظار تحميل الصفحة كاملاً
   ============================================= */

/* DOMContentLoaded — يتأكد أن كل HTML تحمّل قبل ما يبدأ JavaScript يشتغل */
/* DOMContentLoaded — s'assure que tout le HTML est chargé avant que JavaScript commence */
document.addEventListener('DOMContentLoaded', function() {


  /* =============================================
     Protection du Dashboard — accès réservé aux connectés
     حماية لوحة التحكم — الدخول محجوز للمسجلين فقط
     ============================================= */

  if (document.getElementById('dashboard')) {
    const token = localStorage.getItem('opportune_token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('opportune_user') || 'null');
    if (savedUser && savedUser.fullName) {
      document.querySelectorAll('.user-name').forEach(function(el) {
        el.textContent = '👤 ' + savedUser.fullName;
      });
      document.querySelectorAll('.dashboard-header h1 span').forEach(function(el) {
        el.textContent = savedUser.fullName;
      });
    }

    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('opportune_token');
        localStorage.removeItem('opportune_user');
        window.location.href = 'login.html';
      });
    }
  }


  /* =============================================
     Navigation — changement de fond au défilement
     التنقل — تغيير الخلفية عند التمرير
     ============================================= */

  const nav = document.querySelector('nav');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  /* =============================================
     Smooth Scroll — défilement doux vers les sections
     التمرير الناعم نحو الأقسام
     ============================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* =============================================
     Counter Animation — animation des chiffres
     أنيميشن الأرقام
     ============================================= */

  const counters = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(function() {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter) {
    observer.observe(counter);
  });


  /* =============================================
     Fade In — apparition des éléments au défilement
     ظهور العناصر عند التمرير
     ============================================= */

  const cards = document.querySelectorAll('.feature-card, .step-card, .region-card, .stat-card');

  cards.forEach(function(card) {
    card.classList.add('fade-hidden');
  });

  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-visible');
        entry.target.classList.remove('fade-hidden');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function(card) {
    fadeObserver.observe(card);
  });


  /* =============================================
     Language Switcher — changement de langue
     مبدل اللغة — تغيير لغة الصفحة
     ============================================= */

  const langBtns = document.querySelectorAll('.lang-btn');

  const content = {

    en: {
      nav_features: 'Features',
      nav_how: 'How it works',
      nav_regions: 'Regions',
      nav_btn: 'Get Started',
      badge: '⚡ 100% Free for students',
      hero_title: 'Your opportunity <span>is waiting</span>',
      hero_tagline: 'We search every day in Morocco, the Arab world and Europe — you just wait for the reply',
      btn_primary: 'Start for free',
      btn_secondary: 'How it works?',
      features_title: 'Why <span>Opportune</span>?',
      features_sub: 'Everything you need in one place',
      how_title: 'How does <span>Opportune</span> work?',
      how_sub: '3 simple steps — that\'s all',
      regions_title: 'Where do we <span>search</span>?',
      regions_sub: 'Local and international opportunities in one place',
      footer_desc: 'Your opportunity is waiting — we search, you succeed',
      copyright: '© 2024 Opportune — All rights reserved',
      reg_badge: '⚡ Free forever for students',
      reg_title: 'Create your <span>account</span>',
      reg_sub: 'Fill in your details once — we do the rest',
      reg_firstname: 'First Name',
      reg_lastname: 'Last Name',
      reg_email: 'Email',
      reg_password: 'Password',
      reg_country: 'Country',
      reg_city: 'City',
      reg_level: 'Study Level',
      reg_looking: 'I am looking for',
      reg_btn: 'Create my account ⚡',
      reg_login: 'Already have an account?',
      reg_login_link: 'Login here',
      reg_placeholder_country: 'Type your country...',
      reg_placeholder_city: 'Type your city...',
      reg_placeholder_speciality: 'Type your speciality...',
      reg_speciality: 'Field / Speciality',
      login_badge: '👋 Welcome back',
      login_title: 'Login to your <span>account</span>',
      login_sub: 'Enter your credentials to continue',
      login_email: 'Email',
      login_password: 'Password',
      login_forgot: 'Forgot your password?',
      login_btn: 'Login ⚡',
      login_signup: 'Don\'t have an account?',
      login_signup_link: 'Sign up here',
      dash_opportunities: 'Opportunities',
      dash_mycv: 'My CV',
      dash_applications: 'Applications',
      dash_welcome: 'Welcome back,',
      dash_sub: 'Here are your latest opportunities',
      dash_edit: 'Edit Profile',
      dash_new_opp: 'New Opportunities',
      dash_cv_sent: 'CV Sent',
      dash_replies: 'Replies Received',
      dash_success: 'Success Rate',
      dash_latest: 'Latest <span>Opportunities</span>',
      dash_found: 'Found today for your profile',

      /* Features */
      feat1_title: 'Daily automatic search',
      feat1_desc: 'We search hundreds of sites every day without you',
      feat2_title: 'Smart custom CV',
      feat2_desc: 'Your CV adapts automatically to each opportunity',
      feat3_title: 'CV improvement tips',
      feat3_desc: 'Smart suggestions to strengthen your professional profile',
      feat4_title: 'Global coverage',
      feat4_desc: 'Morocco, Arab world, Europe and Remote opportunities',
      feat5_title: 'Instant notifications',
      feat5_desc: 'We notify you immediately when a suitable opportunity is found',
      feat6_title: 'Free for students',
      feat6_desc: '100% free — because your future should not be paid for',

      /* Steps */
      step1_title: 'Create your profile',
      step1_desc: 'Fill in your skills, languages and goals — only once',
      step2_title: 'We search for you',
      step2_desc: 'Opportune searches hundreds of sites every day and finds the best matches',
      step3_title: 'Wait for the reply',
      step3_desc: 'We send your custom CV automatically — you just receive the responses',

      /* Regions */
      reg1_title: 'Morocco',
      reg1_desc: 'All cities — jobs, internships and volunteering',
      reg2_title: 'Arab World',
      reg2_desc: 'All Arab countries including Gulf states',
      reg3_title: 'Europe',
      reg3_desc: 'France, Spain, Germany, Belgium and more',
      reg4_title: 'North America',
      reg4_desc: 'Canada and United States — jobs and scholarships',
      reg5_title: 'Remote',
      reg5_desc: 'Work from anywhere in the world — no borders',
      stat1_label: 'Opportunities daily',
      stat2_label: 'Students benefited',
      stat3_label: 'Countries covered',
      stat4_label: '% Satisfaction rate',
      cv_title: 'Build your <span>CV</span>',
      cv_sub: 'Fill in your information — we\'ll format it professionally',
      cv_personal: '👤 Personal Information',
      cv_name: 'Full Name',
      cv_job: 'Professional Title',
      cv_email: 'Email',
      cv_phone: 'Phone',
      cv_about_title: '📝 About Me',
      cv_skills_title: '⚡ Skills',
      cv_download: 'Download PDF 📄'
    },

    fr: {
      nav_features: 'Fonctionnalités',
      nav_how: 'Comment ça marche',
      nav_regions: 'Régions',
      nav_btn: 'Commencer',
      badge: '⚡ 100% Gratuit pour les étudiants',
      hero_title: 'Votre opportunité <span>vous attend</span>',
      hero_tagline: 'Nous cherchons chaque jour au Maroc, dans le monde arabe et en Europe — vous attendez juste la réponse',
      btn_primary: 'Commencer gratuitement',
      btn_secondary: 'Comment ça marche ?',
      features_title: 'Pourquoi <span>Opportune</span> ?',
      features_sub: 'Tout ce dont vous avez besoin en un seul endroit',
      how_title: 'Comment fonctionne <span>Opportune</span> ?',
      how_sub: '3 étapes simples — c\'est tout',
      regions_title: 'Où cherchons-<span>nous</span> ?',
      regions_sub: 'Opportunités locales et internationales en un seul endroit',
      footer_desc: 'Votre opportunité vous attend — nous cherchons, vous réussissez',
      copyright: '© 2024 Opportune — Tous droits réservés',
      reg_badge: '⚡ Gratuit pour toujours pour les étudiants',
      reg_title: 'Créer votre <span>compte</span>',
      reg_sub: 'Remplissez vos informations une fois — nous faisons le reste',
      reg_firstname: 'Prénom',
      reg_lastname: 'Nom',
      reg_email: 'Email',
      reg_password: 'Mot de passe',
      reg_country: 'Pays',
      reg_city: 'Ville',
      reg_level: 'Niveau d\'études',
      reg_looking: 'Je recherche',
      reg_btn: 'Créer mon compte ⚡',
      reg_login: 'Vous avez déjà un compte?',
      reg_login_link: 'Connectez-vous ici',
      reg_placeholder_country: 'Tapez votre pays...',
      reg_placeholder_city: 'Tapez votre ville...',
      reg_placeholder_speciality: 'Tapez votre spécialité...',
      reg_speciality: 'Domaine / Spécialité',
      login_badge: '👋 Bon retour',
      login_title: 'Connectez-vous à votre <span>compte</span>',
      login_sub: 'Entrez vos identifiants pour continuer',
      login_email: 'Email',
      login_password: 'Mot de passe',
      login_forgot: 'Mot de passe oublié?',
      login_btn: 'Se connecter ⚡',
      login_signup: 'Vous n\'avez pas de compte?',
      login_signup_link: 'Inscrivez-vous ici',
      dash_opportunities: 'Opportunités',
      dash_mycv: 'Mon CV',
      dash_applications: 'Candidatures',
      dash_welcome: 'Bon retour,',
      dash_sub: 'Voici vos dernières opportunités',
      dash_edit: 'Modifier le profil',
      dash_new_opp: 'Nouvelles Opportunités',
      dash_cv_sent: 'CV Envoyés',
      dash_replies: 'Réponses Reçues',
      dash_success: 'Taux de Réussite',
      dash_latest: 'Dernières <span>Opportunités</span>',
      dash_found: 'Trouvées aujourd\'hui pour votre profil',
      /* Fonctionnalités */
      feat1_title: 'Recherche automatique quotidienne',
      feat1_desc: 'Nous cherchons sur des centaines de sites chaque jour sans vous',
      feat2_title: 'CV intelligent personnalisé',
      feat2_desc: 'Votre CV s\'adapte automatiquement à chaque opportunité',
      feat3_title: 'Conseils d\'amélioration CV',
      feat3_desc: 'Suggestions intelligentes pour renforcer votre profil professionnel',
      feat4_title: 'Couverture mondiale',
      feat4_desc: 'Maroc, monde arabe, Europe et opportunités à distance',
      feat5_title: 'Notifications instantanées',
      feat5_desc: 'Nous vous informons immédiatement quand une opportunité est trouvée',
      feat6_title: 'Gratuit pour les étudiants',
      feat6_desc: '100% gratuit — parce que votre avenir ne doit pas être payant',

      /* Étapes */
      step1_title: 'Créez votre profil',
      step1_desc: 'Remplissez vos compétences, langues et objectifs — une seule fois',
      step2_title: 'Nous cherchons pour vous',
      step2_desc: 'Opportune cherche sur des centaines de sites chaque jour',
      step3_title: 'Attendez la réponse',
      step3_desc: 'Nous envoyons votre CV automatiquement — vous recevez juste les réponses',

      /* Régions */
      reg1_title: 'Maroc',
      reg1_desc: 'Toutes les villes — emplois, stages et bénévolat',
      reg2_title: 'Monde Arabe',
      reg2_desc: 'Tous les pays arabes y compris les pays du Golfe',
      reg3_title: 'Europe',
      reg3_desc: 'France, Espagne, Allemagne, Belgique et plus',
      reg4_title: 'Amérique du Nord',
      reg4_desc: 'Canada et États-Unis — emplois et bourses',
      reg5_title: 'À distance',
      reg5_desc: 'Travaillez de n\'importe où dans le monde — sans frontières',
      stat1_label: 'Opportunités par jour',
      stat2_label: 'Étudiants bénéficiaires',
      stat3_label: 'Pays couverts',
      stat4_label: '% Taux de satisfaction',
      cv_title: 'Créer votre <span>CV</span>',
      cv_sub: 'Remplissez vos informations — nous le formaterons professionnellement',
      cv_personal: '👤 Informations Personnelles',
      cv_name: 'Nom Complet',
      cv_job: 'Titre Professionnel',
      cv_email: 'Email',
      cv_phone: 'Téléphone',
      cv_about_title: '📝 À Propos',
      cv_skills_title: '⚡ Compétences',
      cv_download: 'Télécharger PDF 📄'
    },

    ar: {
      nav_features: 'المميزات',
      nav_how: 'كيف يعمل',
      nav_regions: 'المناطق',
      nav_btn: 'ابدأ الآن',
      badge: '⚡ مجاني 100% للطلاب',
      hero_title: 'فرصتك <span>تنتظرك</span>',
      hero_tagline: 'نبحث كل يوم في المغرب والعالم العربي وأوروبا — أنت فقط تنتظر الرد',
      btn_primary: 'ابدأ الآن مجاناً',
      btn_secondary: 'كيف يعمل؟',
      features_title: 'لماذا <span>Opportune</span>؟',
      features_sub: 'كل ما تحتاجه في مكان واحد',
      how_title: 'كيف يعمل <span>Opportune</span>؟',
      how_sub: '3 خطوات بسيطة — هذا كل شيء',
      regions_title: 'أين <span>نبحث</span>؟',
      regions_sub: 'فرص محلية ودولية في مكان واحد',
      footer_desc: 'فرصتك تنتظرك — نحن نبحث، أنت تنجح',
      copyright: '© 2024 Opportune — جميع الحقوق محفوظة',
      reg_badge: '⚡ مجاني للأبد للطلاب',
      reg_title: 'أنشئ <span>حسابك</span>',
      reg_sub: 'املأ معلوماتك مرة واحدة — نحن نفعل الباقي',
      reg_firstname: 'الاسم الأول',
      reg_lastname: 'اسم العائلة',
      reg_email: 'البريد الإلكتروني',
      reg_password: 'كلمة المرور',
      reg_country: 'الدولة',
      reg_city: 'المدينة',
      reg_level: 'المستوى الدراسي',
      reg_looking: 'أبحث عن',
      reg_btn: 'إنشاء حسابي ⚡',
      reg_login: 'لديك حساب بالفعل؟',
      reg_login_link: 'سجل دخولك هنا',
      reg_placeholder_country: 'اكتب دولتك...',
      reg_placeholder_city: 'اكتب مدينتك...',
      reg_placeholder_speciality: 'اكتب تخصصك...',
      reg_speciality: 'المجال / التخصص',
      login_badge: '👋 مرحباً بعودتك',
      login_title: 'سجل دخولك إلى <span>حسابك</span>',
      login_sub: 'أدخل بياناتك للمتابعة',
      login_email: 'البريد الإلكتروني',
      login_password: 'كلمة المرور',
      login_forgot: 'نسيت كلمة المرور؟',
      login_btn: 'تسجيل الدخول ⚡',
      login_signup: 'ليس لديك حساب؟',
      login_signup_link: 'سجل هنا',
      dash_opportunities: 'الفرص',
      dash_mycv: 'سيرتي الذاتية',
      dash_applications: 'طلباتي',
      dash_welcome: 'مرحباً بعودتك،',
      dash_sub: 'هذه أحدث الفرص المناسبة لك',
      dash_edit: 'تعديل الملف',
      dash_new_opp: 'فرص جديدة',
      dash_cv_sent: 'CV مرسلة',
      dash_replies: 'ردود مستقبلة',
      dash_success: 'نسبة النجاح',
      dash_latest: 'أحدث <span>الفرص</span>',
      dash_found: 'وجدناها اليوم لملفك الشخصي',
      /* المميزات */
      feat1_title: 'بحث تلقائي يومي',
      feat1_desc: 'نبحث في مئات المواقع كل يوم بدونك',
      feat2_title: 'CV ذكي مخصص',
      feat2_desc: 'سيرتك الذاتية تتكيف تلقائياً لكل فرصة',
      feat3_title: 'نصائح لتحسين CV',
      feat3_desc: 'اقتراحات ذكية لتقوية ملفك المهني',
      feat4_title: 'تغطية عالمية',
      feat4_desc: 'المغرب، العالم العربي، أوروبا وفرص عن بعد',
      feat5_title: 'إشعارات فورية',
      feat5_desc: 'نخبرك فوراً عند وجود فرصة مناسبة لك',
      feat6_title: 'مجاني للطلاب',
      feat6_desc: 'مجاني 100% — لأن مستقبلك لا يجب أن يكون مدفوعاً',

      /* الخطوات */
      step1_title: 'أنشئ ملفك الشخصي',
      step1_desc: 'املأ مهاراتك ولغاتك وأهدافك — مرة واحدة فقط',
      step2_title: 'نحن نبحث عنك',
      step2_desc: 'Opportune يبحث في مئات المواقع كل يوم ويجد أفضل الفرص',
      step3_title: 'انتظر الرد',
      step3_desc: 'نرسل CV ديالك تلقائياً — أنت فقط تستقبل الردود',

      /* المناطق */
      reg1_title: 'المغرب',
      reg1_desc: 'كل المدن — عمل، تدريب وتطوع',
      reg2_title: 'العالم العربي',
      reg2_desc: 'كل الدول العربية بما فيها دول الخليج',
      reg3_title: 'أوروبا',
      reg3_desc: 'فرنسا، إسبانيا، ألمانيا، بلجيكا والمزيد',
      reg4_title: 'أمريكا الشمالية',
      reg4_desc: 'كندا والولايات المتحدة — عمل ومنح',
      reg5_title: 'عن بعد',
      reg5_desc: 'اشتغل من أي مكان في العالم — بلا حدود',
      stat1_label: 'فرصة يومياً',
      stat2_label: 'طالب مستفيد',
      stat3_label: 'دولة مغطاة',
      stat4_label: '% نسبة الرضا',
      cv_title: 'ابنِ <span>سيرتك الذاتية</span>',
      cv_sub: 'املأ معلوماتك — سنقوم بتنسيقها باحترافية',
      cv_personal: '👤 المعلومات الشخصية',
      cv_name: 'الاسم الكامل',
      cv_job: 'المسمى الوظيفي',
      cv_email: 'البريد الإلكتروني',
      cv_phone: 'الهاتف',
      cv_about_title: '📝 نبذة عني',
      cv_skills_title: '⚡ المهارات',
      cv_download: 'تحميل PDF 📄'

    }

  };

  /* عند الضغط على زر لغة */
  /* Au clic sur un bouton de langue */
  langBtns.forEach(function(btn) {

    btn.addEventListener('click', function() {

      langBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const lang = btn.getAttribute('data-lang');
      currentLang = lang;

      /* نغير اتجاه الصفحة حسب اللغة */
      /* On change la direction de la page selon la langue */
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
      }

      const c = content[lang];

      /* =============================================
         تبديل محتوى opportune.html
         ============================================= */
      if (document.querySelector('.nav-links a[href="#features"]')) {
        document.querySelector('.nav-links a[href="#features"]').textContent = c.nav_features;
        document.querySelector('.nav-links a[href="#how"]').textContent = c.nav_how;
        document.querySelector('.nav-links a[href="#regions"]').textContent = c.nav_regions;
        document.querySelector('.btn-nav').textContent = c.nav_btn;
        document.querySelector('.badge').innerHTML = c.badge;
        document.querySelector('#hero h1').innerHTML = c.hero_title;
        document.querySelector('.tagline').textContent = c.hero_tagline;
        document.querySelector('.btn-primary').textContent = c.btn_primary;
        document.querySelector('.btn-secondary').textContent = c.btn_secondary;
        document.querySelector('#features h2').innerHTML = c.features_title;
        document.querySelector('#features .section-sub').textContent = c.features_sub;
        document.querySelector('#how h2').innerHTML = c.how_title;
        document.querySelector('#how .section-sub').textContent = c.how_sub;
        document.querySelector('#regions h2').innerHTML = c.regions_title;
        document.querySelector('#regions .section-sub').textContent = c.regions_sub;
        document.querySelector('.footer-col p').textContent = c.footer_desc;
        document.querySelector('.footer-bottom p').textContent = c.copyright;
        document.querySelectorAll('[data-key]').forEach(function(el) {
          const key = el.getAttribute('data-key');
          if (c[key]) {
            el.textContent = c[key];
          }
        });
      }
    
    
      

      /* =============================================
         تبديل محتوى register.html
         ============================================= */
      if (document.getElementById('register')) {
        const regBadge = document.querySelector('#register .badge');
        const regTitle = document.querySelector('#register h1');
        const regSub = document.querySelector('#register .register-header p');
        const regBtn = document.querySelector('#register .btn-primary');
        const regLoginTxt = document.querySelector('.login-link');

        if (regBadge) regBadge.innerHTML = c.reg_badge;
        if (regTitle) regTitle.innerHTML = c.reg_title;
        if (regSub) regSub.textContent = c.reg_sub;
        if (regBtn) regBtn.innerHTML = c.reg_btn;
        if (regLoginTxt) regLoginTxt.innerHTML = c.reg_login + ' <a href="login.html">' + c.reg_login_link + '</a>';

        document.querySelector('label[for="firstname"]').textContent = c.reg_firstname;
        document.querySelector('label[for="lastname"]').textContent = c.reg_lastname;
        document.querySelector('label[for="email"]').textContent = c.reg_email;
        document.querySelector('label[for="password"]').textContent = c.reg_password;
        document.querySelector('label[for="country"]').textContent = c.reg_country;
        document.querySelector('label[for="city"]').textContent = c.reg_city;
        document.querySelector('label[for="level"]').textContent = c.reg_level;
        document.querySelector('label[for="speciality"]').textContent = c.reg_speciality;

        document.getElementById('country').placeholder = c.reg_placeholder_country;
        document.getElementById('city').placeholder = c.reg_placeholder_city;
        document.getElementById('speciality').placeholder = c.reg_placeholder_speciality;
      }

      /* =============================================
         تبديل محتوى login.html
         ============================================= */
      if (document.getElementById('login')) {
        const loginBadge = document.querySelector('#login .badge');
        const loginTitle = document.querySelector('#login h1');
        const loginSub = document.querySelector('#login .register-header p');
        const loginBtn = document.querySelector('#login .btn-primary');
        const loginTxt = document.querySelector('#login .login-link');

        if (loginBadge) loginBadge.innerHTML = c.login_badge;
        if (loginTitle) loginTitle.innerHTML = c.login_title;
        if (loginSub) loginSub.textContent = c.login_sub;
        if (loginBtn) loginBtn.innerHTML = c.login_btn;
        if (loginTxt) loginTxt.innerHTML = c.login_signup + ' <a href="register.html">' + c.login_signup_link + '</a>';

        const emailLabel = document.querySelector('label[for="email"]');
        const passwordLabel = document.querySelector('label[for="password"]');
        const forgotLink = document.querySelector('.forgot-password a');

        if (emailLabel) emailLabel.textContent = c.login_email;
        if (passwordLabel) passwordLabel.textContent = c.login_password;
        if (forgotLink) forgotLink.textContent = c.login_forgot;
      }

      /* =============================================
         تبديل محتوى dashboard.html
         ============================================= */
      if (document.getElementById('dashboard')) {
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks[0]) navLinks[0].textContent = c.dash_opportunities;
        if (navLinks[1]) navLinks[1].textContent = c.dash_mycv;
        if (navLinks[2]) navLinks[2].textContent = c.dash_applications;

        const dashHeader = document.querySelector('.dashboard-header h1');
        const dashSub = document.querySelector('.dashboard-header p');
        const dashBtn = document.querySelector('.dashboard-header .btn-primary');
        const dashLatest = document.querySelector('.dash-section-header h2');
        const dashFound = document.querySelector('.dash-section-header p');

        if (dashHeader) dashHeader.innerHTML = c.dash_welcome + ' <span>Chadiya</span> 👋';
        if (dashSub) dashSub.textContent = c.dash_sub;
        if (dashBtn) dashBtn.textContent = c.dash_edit;
        if (dashLatest) dashLatest.innerHTML = c.dash_latest;
        if (dashFound) dashFound.textContent = c.dash_found;

        const statLabels = document.querySelectorAll('.dash-stat-label');
        if (statLabels[0]) statLabels[0].textContent = c.dash_new_opp;
        if (statLabels[1]) statLabels[1].textContent = c.dash_cv_sent;
        if (statLabels[2]) statLabels[2].textContent = c.dash_replies;
        if (statLabels[3]) statLabels[3].textContent = c.dash_success;
      }
       /* ============================================= */
      /* تبديل محتوى cv-builder                        */
      /* ============================================= */
      if (document.getElementById('cv-builder')) {
        const cvTitle = document.querySelector('.cv-header h1');
        const cvSub = document.querySelector('.cv-header p');
        const cvDownload = document.querySelector('.cv-actions .btn-primary');

        if (cvTitle) cvTitle.innerHTML = c.cv_title;
        if (cvSub) cvSub.textContent = c.cv_sub;
        if (cvDownload) cvDownload.innerHTML = c.cv_download;

        const sections = document.querySelectorAll('.cv-form-section h3');
        if (sections[0]) sections[0].textContent = c.cv_personal;
        if (sections[1]) sections[1].textContent = c.cv_about_title;
        if (sections[2]) sections[2].textContent = c.cv_skills_title;

        const cvNameLabel = document.querySelector('label[for="cv-name"]');
        const cvTitleLabel = document.querySelector('label[for="cv-title"]');
        const cvEmailLabel = document.querySelector('label[for="cv-email"]');
        const cvPhoneLabel = document.querySelector('label[for="cv-phone"]');

        if (cvNameLabel) cvNameLabel.textContent = c.cv_name;
        if (cvTitleLabel) cvTitleLabel.textContent = c.cv_job;
        if (cvEmailLabel) cvEmailLabel.textContent = c.cv_email;
        if (cvPhoneLabel) cvPhoneLabel.textContent = c.cv_phone;
      }

    });
  });


  /* =============================================
     Dynamic Select — spécialités selon le niveau
     التخصصات حسب المستوى
     ============================================= */

  const specialities = {
    bac: ['Sciences Mathématiques', 'Sciences de la Vie et de la Terre', 'Sciences Économiques', 'Lettres et Sciences Humaines', 'Sciences et Technologies', 'Arts Appliqués'],
    bts: ['Informatique', 'Commerce', 'Comptabilité', 'Électronique', 'Mécanique', 'Hôtellerie', 'Tourisme'],
    dut: ['Informatique', 'Génie Civil', 'Génie Électrique', 'Gestion', 'Marketing'],
    tsdi: ['Développement Web', 'Réseaux', 'Base de données', 'Systèmes d\'information'],
    tsi: ['Électronique', 'Électrotechnique', 'Automatisme'],
    tc: ['Commerce International', 'Marketing', 'Vente'],
    tcc: ['Comptabilité', 'Finance', 'Audit'],
    cpge: ['MPSI', 'PCSI', 'BCPST', 'ECE', 'ECS'],
    licence: ['Informatique', 'Droit', 'Économie', 'Gestion', 'Lettres', 'Histoire', 'Géographie', 'Physique', 'Chimie', 'Mathématiques', 'Biologie'],
    bachelor: ['Business', 'Marketing', 'Communication', 'Design', 'Informatique'],
    licence_pro: ['Commerce', 'Logistique', 'Ressources Humaines', 'Finance', 'Informatique'],
    master1: ['Informatique', 'Finance', 'Droit', 'Management', 'Marketing', 'Génie Civil', 'Économie'],
    master2: ['Informatique', 'Finance', 'Droit', 'Management', 'Marketing', 'Génie Civil', 'Économie'],
    master_pro: ['Management', 'Finance', 'Marketing Digital', 'Ressources Humaines'],
    ingenieur: ['Génie Informatique', 'Génie Civil', 'Génie Électrique', 'Génie Industriel', 'Génie Chimique'],
    grande_ecole: ['Management', 'Commerce', 'Ingénierie'],
    mba: ['Management', 'Finance', 'Marketing', 'Entrepreneuriat'],
    doctorat: ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Droit', 'Économie', 'Gestion'],
    ofppt: ['Informatique', 'Électronique', 'Mécanique', 'Hôtellerie', 'Commerce', 'Couture', 'Coiffure', 'Plomberie', 'Électricité'],
    formation_pro: ['Comptabilité', 'Secrétariat', 'Commerce', 'Informatique', 'Langue'],
    formation_tech: ['Électricité', 'Plomberie', 'Soudure', 'Menuiserie', 'Mécanique Auto'],
    formation_art: ['Musique', 'Peinture', 'Sculpture', 'Photographie', 'Cinéma'],
    formation_lang: ['Anglais', 'Français', 'Espagnol', 'Allemand', 'Arabe', 'Chinois'],
    bootcamp: ['Développement Web', 'Data Science', 'UX/UI Design', 'Cybersécurité', 'Marketing Digital'],
    certification: ['Microsoft', 'Cisco', 'Google', 'AWS', 'Adobe', 'PMI']
  };

  const levelSelect = document.getElementById('level');
  const specialityGroup = document.getElementById('speciality-group');
  const specialityInput = document.getElementById('speciality');

  if (levelSelect) {
    levelSelect.addEventListener('change', function() {
      const selectedLevel = this.value;
      if (specialities[selectedLevel]) {
        specialityGroup.style.display = 'block';
      } else {
        specialityGroup.style.display = 'none';
      }
    });
  }


  /* =============================================
     Autocomplete — villes, pays, spécialités
     الإكمال التلقائي
     ============================================= */

  let currentLang = 'en';

  const data = {
    en: {
      cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Beni Mellal', 'Nador', 'Taza', 'Settat', 'Khemissat', 'Berrechid', 'Larache', 'Guelmim', 'Ouarzazate', 'Essaouira', 'Ifrane', 'Dakhla', 'Laayoune'],
      countries: ['Morocco', 'Algeria', 'Tunisia', 'Libya', 'Egypt', 'Mauritania', 'Sudan', 'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Iraq', 'Syria', 'Palestine', 'Yemen', 'Senegal', 'Ivory Coast', 'Mali', 'Niger', 'Cameroon', 'Gabon', 'France', 'Spain', 'Belgium', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Switzerland', 'Sweden', 'UK', 'Canada', 'United States', 'Mexico', 'China', 'Japan', 'South Korea', 'India', 'Turkey', 'Australia', 'New Zealand'],
      specialities: ['Computer Science', 'Software Engineering', 'Web Development', 'Data Science', 'Cybersecurity', 'Networks', 'Artificial Intelligence', 'Law', 'Economics', 'Management', 'Finance', 'Accounting', 'Marketing', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Medicine', 'Pharmacy', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Literature', 'History', 'Architecture', 'Design', 'Journalism', 'Education', 'Psychology', 'Agriculture', 'Logistics']
    },
    fr: {
      cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Taza', 'Settat', 'Khémissat', 'Berrechid', 'Larache', 'Guelmim', 'Ouarzazate', 'Essaouira', 'Ifrane', 'Dakhla', 'Laâyoune'],
      countries: ['Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie', 'Soudan', 'Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar', 'Koweït', 'Bahreïn', 'Oman', 'Jordanie', 'Liban', 'Irak', 'Syrie', 'Palestine', 'Yémen', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Niger', 'Cameroun', 'Gabon', 'France', 'Espagne', 'Belgique', 'Allemagne', 'Italie', 'Portugal', 'Pays-Bas', 'Suisse', 'Suède', 'Royaume-Uni', 'Canada', 'États-Unis', 'Mexique', 'Chine', 'Japon', 'Corée du Sud', 'Inde', 'Turquie', 'Australie', 'Nouvelle-Zélande'],
      specialities: ['Informatique', 'Génie Logiciel', 'Développement Web', 'Science des Données', 'Cybersécurité', 'Réseaux', 'Intelligence Artificielle', 'Droit', 'Économie', 'Gestion', 'Finance', 'Comptabilité', 'Marketing', 'Génie Civil', 'Génie Électrique', 'Génie Mécanique', 'Médecine', 'Pharmacie', 'Biologie', 'Chimie', 'Physique', 'Mathématiques', 'Lettres', 'Histoire', 'Architecture', 'Design', 'Journalisme', 'Éducation', 'Psychologie', 'Agriculture', 'Logistique']
    },
    ar: {
      cities: ['الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان', 'آسفي', 'المحمدية', 'خريبكة', 'الجديدة', 'بني ملال', 'الناظور', 'تازة', 'سطات', 'الخميسات', 'برشيد', 'العرائش', 'كلميم', 'ورزازات', 'الصويرة', 'إفران', 'الداخلة', 'العيون'],
      countries: ['المغرب', 'الجزائر', 'تونس', 'ليبيا', 'مصر', 'موريتانيا', 'السودان', 'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'قطر', 'الكويت', 'البحرين', 'عُمان', 'الأردن', 'لبنان', 'العراق', 'سوريا', 'فلسطين', 'اليمن', 'السنغال', 'ساحل العاج', 'مالي', 'النيجر', 'الكاميرون', 'الغابون', 'فرنسا', 'إسبانيا', 'بلجيكا', 'ألمانيا', 'إيطاليا', 'البرتغال', 'هولندا', 'سويسرا', 'السويد', 'المملكة المتحدة', 'كندا', 'الولايات المتحدة', 'المكسيك', 'الصين', 'اليابان', 'كوريا الجنوبية', 'الهند', 'تركيا', 'أستراليا', 'نيوزيلندا'],
      specialities: ['علوم الحاسوب', 'هندسة البرمجيات', 'تطوير الويب', 'علم البيانات', 'الأمن السيبراني', 'الشبكات', 'الذكاء الاصطناعي', 'القانون', 'الاقتصاد', 'الإدارة', 'المالية', 'المحاسبة', 'التسويق', 'الهندسة المدنية', 'الهندسة الكهربائية', 'الهندسة الميكانيكية', 'الطب', 'الصيدلة', 'الأحياء', 'الكيمياء', 'الفيزياء', 'الرياضيات', 'الآداب', 'التاريخ', 'العمارة', 'التصميم', 'الصحافة', 'التربية', 'علم النفس', 'الزراعة', 'اللوجستيك']
    }
  };

  function setupAutocomplete(inputId, suggestionsId, getDataFn) {
    const input = document.getElementById(inputId);
    const suggestionsList = document.getElementById(suggestionsId);
    if (!input || !suggestionsList) return;

    input.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      if (query.length === 0) {
        suggestionsList.style.display = 'none';
        return;
      }
      const currentData = getDataFn();
      const filtered = currentData.filter(function(item) {
        return item.toLowerCase().includes(query);
      });
      if (filtered.length === 0) {
        suggestionsList.style.display = 'none';
        return;
      }
      suggestionsList.innerHTML = '';
      filtered.forEach(function(item) {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = item;
        div.addEventListener('click', function() {
          input.value = item;
          suggestionsList.style.display = 'none';
        });
        suggestionsList.appendChild(div);
      });
      suggestionsList.style.display = 'block';
    });

    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
      }
    });
  }

  setupAutocomplete('country', 'country-suggestions', function() { return data[currentLang].countries; });
  setupAutocomplete('city', 'city-suggestions', function() { return data[currentLang].cities; });
  setupAutocomplete('speciality', 'speciality-suggestions', function() { return data[currentLang].specialities; });


  /* =============================================
     Goal buttons — sélection de l'objectif
     أزرار الهدف
     ============================================= */

  const goalBtns = document.querySelectorAll('.goal-btn');
  goalBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('active');
    });
  });


  /* =============================================
     Validation d'email — fonction utilitaire
     التحقق من صحة البريد الإلكتروني
     ============================================= */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function markField(input, hasError) {
    if (!input) return;
    input.classList.toggle('input-error', hasError);
  }


  /* =============================================
     Configuration de l'API Backend
     إعدادات الـ API
     ============================================= */

  const API_BASE = 'http://localhost:5000/api';


  /* =============================================
     Bouton Login — validation puis appel API
     زر الدخول — التحقق ثم الاتصال بالسيرفر
     ============================================= */

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async function() {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      let valid = true;

      if (!isValidEmail(email)) {
        markField(emailInput, true);
        valid = false;
      } else {
        markField(emailInput, false);
      }

      if (password.length === 0) {
        markField(passwordInput, true);
        valid = false;
      } else {
        markField(passwordInput, false);
      }

      if (!valid) return;

      const originalText = loginBtn.textContent;
      loginBtn.disabled = true;
      loginBtn.textContent = 'Connexion...';

      try {
        const response = await fetch(API_BASE + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || 'Email ou mot de passe incorrect.');
          markField(emailInput, true);
          markField(passwordInput, true);
          loginBtn.disabled = false;
          loginBtn.textContent = originalText;
          return;
        }

        localStorage.setItem('opportune_token', data.token);
        localStorage.setItem('opportune_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';

      } catch (err) {
        console.error('Erreur de connexion au serveur:', err);
        alert('Impossible de contacter le serveur. Vérifiez que le backend est démarré (npm run dev / node app.js).');
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;
      }
    });
  }


  /* =============================================
     Bouton Register — validation puis appel API
     زر التسجيل — التحقق ثم الاتصال بالسيرفر
     ============================================= */

  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', async function() {
      const firstnameInput = document.getElementById('firstname');
      const lastnameInput = document.getElementById('lastname');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      let valid = true;

      [firstnameInput, lastnameInput].forEach(function(input) {
        const hasError = input.value.trim().length === 0;
        markField(input, hasError);
        if (hasError) valid = false;
      });

      if (!isValidEmail(emailInput.value.trim())) {
        markField(emailInput, true);
        valid = false;
      } else {
        markField(emailInput, false);
      }

      if (passwordInput.value.trim().length < 6) {
        markField(passwordInput, true);
        valid = false;
      } else {
        markField(passwordInput, false);
      }

      if (!valid) return;

      const fullName = firstnameInput.value.trim() + ' ' + lastnameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      /* بيانات الملف الشخصي — البلد، المدينة، المستوى، التخصص، الهدف */
      /* Données du profil — pays, ville, niveau, spécialité, objectifs */
      const country = document.getElementById('country').value.trim();
      const city = document.getElementById('city').value.trim();
      const studyLevel = document.getElementById('level').value;
      const speciality = document.getElementById('speciality').value.trim();

      const goals = {
        job: !!document.querySelector('.goal-btn[data-goal="job"]')?.classList.contains('active'),
        internship: !!document.querySelector('.goal-btn[data-goal="internship"]')?.classList.contains('active'),
        volunteer: !!document.querySelector('.goal-btn[data-goal="volunteer"]')?.classList.contains('active'),
        remote: !!document.querySelector('.goal-btn[data-goal="remote"]')?.classList.contains('active')
      };

      const originalText = registerBtn.textContent;
      registerBtn.disabled = true;
      registerBtn.textContent = 'Création...';

      try {
        const response = await fetch(API_BASE + '/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName,
            email: email,
            password: password,
            country: country,
            city: city,
            studyLevel: studyLevel,
            speciality: speciality,
            goals: goals
          })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Erreur lors de la création du compte.");
          if (response.status === 400 && /email/i.test(data.message || '')) markField(emailInput, true);
          registerBtn.disabled = false;
          registerBtn.textContent = originalText;
          return;
        }

        localStorage.setItem('opportune_token', data.token);
        localStorage.setItem('opportune_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';

      } catch (err) {
        console.error('Erreur de connexion au serveur:', err);
        alert('Impossible de contacter le serveur. Vérifiez que le backend est démarré (npm run dev / node app.js).');
        registerBtn.disabled = false;
        registerBtn.textContent = originalText;
      }
    });
  }


}); /* نهاية DOMContentLoaded — fin de DOMContentLoaded */


/* ================================================================
   NOTE: CV Builder functionality has been moved to cv-builder.js
   which is a complete modular ES6 application.
   See: cv-builder.js for all CV Builder logic including:
   - Live Preview, Auto-Save, LocalStorage, PDF Export, QR Code
   - Drag & Drop Photo, Tag Inputs, Form Validation, Toast Notifications
   - Section Collapse/Expand, Dark/Light Theme, Layout Toggle
   ================================================================ */