// Internationalization (i18n) System
// Multi-language support: English, French, Spanish, Mandarin

class I18nManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.supportedLanguages = {
            'en': { name: 'English', nativeName: 'English' },
            'fr': { name: 'French', nativeName: 'Français' },
            'es': { name: 'Spanish', nativeName: 'Español' },
            'zh': { name: 'Mandarin', nativeName: '中文' }
        };
        this.translations = {};
        this.initializeTranslations();
    }

    // Load all translations
    initializeTranslations() {
        this.translations = {
            'en': {
                // Header & Navigation
                'nav.home': 'Home',
                'nav.parks': 'All Parks',
                'nav.booking': 'Book Now',
                'nav.account': 'Account',
                'nav.admin': 'Admin',
                'nav.language': 'Language',
                'nav.logout': 'Logout',

                // Home Page
                'home.title': 'Ontario Parks - Discover Nature',
                'home.subtitle': 'Plan your perfect camping adventure in Ontario\'s beautiful parks',
                'home.searchPlaceholder': 'Search parks by name',
                'home.search': 'Search',
                'home.featured': 'Featured Parks',
                'home.viewDetails': 'View Details',
                'home.bookNow': 'Book Now',

                // Park Details
                'park.details': 'Park Details',
                'park.location': 'Location',
                'park.description': 'Description',
                'park.facilities': 'Facilities',
                'park.difficulty': 'Difficulty',
                'park.rating': 'Rating',
                'park.reviews': 'Reviews',
                'park.availability': 'Availability',
                'park.checkIn': 'Check-in',
                'park.checkOut': 'Check-out',
                'park.nights': 'Nights',
                'park.pricePerNight': 'Price per night',
                'park.totalPrice': 'Total price',
                'park.reserve': 'Reserve',

                // Booking
                'booking.title': 'Book Your Stay',
                'booking.guestName': 'Guest Name',
                'booking.email': 'Email',
                'booking.phone': 'Phone',
                'booking.checkInDate': 'Check-in Date',
                'booking.checkOutDate': 'Check-out Date',
                'booking.campsiteType': 'Campsite Type',
                'booking.specialRequests': 'Special Requests',
                'booking.reviewBooking': 'Review Booking',
                'booking.confirmBooking': 'Confirm Booking',
                'booking.bookingConfirmed': 'Booking Confirmed!',
                'booking.confirmationId': 'Confirmation ID',
                'booking.checkEmail': 'Check your email for confirmation details',

                // Account
                'account.profile': 'Profile',
                'account.settings': 'Settings',
                'account.bookingHistory': 'Booking History',
                'account.preferences': 'Preferences',
                'account.logout': 'Logout',
                'account.editProfile': 'Edit Profile',
                'account.changePassword': 'Change Password',
                'account.savedParks': 'Saved Parks',
                'account.newsletter': 'Newsletter Subscription',

                // Reviews
                'review.title': 'Reviews & Ratings',
                'review.yourRating': 'Your Rating',
                'review.reviewTitle': 'Review Title',
                'review.reviewContent': 'Your Review',
                'review.submit': 'Submit Review',
                'review.helpful': 'Helpful',
                'review.notHelpful': 'Not Helpful',
                'review.averageRating': 'Average Rating',
                'review.totalReviews': 'Total Reviews',
                'review.filterBy': 'Filter by rating',

                // Search & Filters
                'filter.difficulty': 'Difficulty',
                'filter.easy': 'Easy',
                'filter.moderate': 'Moderate',
                'filter.hard': 'Hard',
                'filter.facilities': 'Facilities',
                'filter.camping': 'Camping',
                'filter.hiking': 'Hiking',
                'filter.fishing': 'Fishing',
                'filter.swimming': 'Swimming',
                'filter.biking': 'Biking',
                'filter.price': 'Price Range',
                'filter.distance': 'Distance',
                'filter.reset': 'Reset Filters',
                'filter.apply': 'Apply Filters',

                // Payment
                'payment.title': 'Payment',
                'payment.cardNumber': 'Card Number',
                'payment.expiry': 'Expiry Date',
                'payment.cvc': 'CVC',
                'payment.cardholderName': 'Cardholder Name',
                'payment.billingAddress': 'Billing Address',
                'payment.pay': 'Pay Now',
                'payment.success': 'Payment Successful',
                'payment.failed': 'Payment Failed',

                // Messages
                'message.loading': 'Loading...',
                'message.error': 'An error occurred',
                'message.success': 'Success',
                'message.saved': 'Saved successfully',
                'message.confirm': 'Are you sure?',
                'message.noResults': 'No results found',
                'message.tryAgain': 'Try Again',
                'message.back': 'Back',
                'message.next': 'Next',
                'message.close': 'Close',

                // Footer
                'footer.about': 'About',
                'footer.contact': 'Contact',
                'footer.privacy': 'Privacy Policy',
                'footer.terms': 'Terms of Service',
                'footer.copyright': '© 2026 Ontario Parks. All rights reserved.'
            },
            'fr': {
                // Header & Navigation
                'nav.home': 'Accueil',
                'nav.parks': 'Tous les parcs',
                'nav.booking': 'Réserver',
                'nav.account': 'Compte',
                'nav.admin': 'Administration',
                'nav.language': 'Langue',
                'nav.logout': 'Déconnexion',

                // Home Page
                'home.title': 'Parcs de l\'Ontario - Découvrez la nature',
                'home.subtitle': 'Planifiez votre aventure de camping parfaite dans les magnifiques parcs de l\'Ontario',
                'home.searchPlaceholder': 'Rechercher des parcs par nom',
                'home.search': 'Rechercher',
                'home.featured': 'Parcs en vedette',
                'home.viewDetails': 'Voir les détails',
                'home.bookNow': 'Réserver maintenant',

                // Park Details
                'park.details': 'Détails du parc',
                'park.location': 'Localisation',
                'park.description': 'Description',
                'park.facilities': 'Installations',
                'park.difficulty': 'Difficulté',
                'park.rating': 'Évaluation',
                'park.reviews': 'Avis',
                'park.availability': 'Disponibilité',
                'park.checkIn': 'Arrivée',
                'park.checkOut': 'Départ',
                'park.nights': 'Nuits',
                'park.pricePerNight': 'Prix par nuit',
                'park.totalPrice': 'Prix total',
                'park.reserve': 'Réserver',

                // Booking
                'booking.title': 'Réservez votre séjour',
                'booking.guestName': 'Nom du client',
                'booking.email': 'Courriel',
                'booking.phone': 'Téléphone',
                'booking.checkInDate': 'Date d\'arrivée',
                'booking.checkOutDate': 'Date de départ',
                'booking.campsiteType': 'Type de site de camping',
                'booking.specialRequests': 'Demandes spéciales',
                'booking.reviewBooking': 'Vérifier la réservation',
                'booking.confirmBooking': 'Confirmer la réservation',
                'booking.bookingConfirmed': 'Réservation confirmée!',
                'booking.confirmationId': 'Numéro de confirmation',
                'booking.checkEmail': 'Vérifiez votre courriel pour les détails de confirmation',

                // Account
                'account.profile': 'Profil',
                'account.settings': 'Paramètres',
                'account.bookingHistory': 'Historique des réservations',
                'account.preferences': 'Préférences',
                'account.logout': 'Déconnexion',
                'account.editProfile': 'Modifier le profil',
                'account.changePassword': 'Changer le mot de passe',
                'account.savedParks': 'Parcs enregistrés',
                'account.newsletter': 'Abonnement à la lettre d\'information',

                // Reviews
                'review.title': 'Avis et évaluations',
                'review.yourRating': 'Votre évaluation',
                'review.reviewTitle': 'Titre de l\'avis',
                'review.reviewContent': 'Votre avis',
                'review.submit': 'Soumettre l\'avis',
                'review.helpful': 'Utile',
                'review.notHelpful': 'Pas utile',
                'review.averageRating': 'Évaluation moyenne',
                'review.totalReviews': 'Nombre total d\'avis',
                'review.filterBy': 'Filtrer par évaluation',

                // Search & Filters
                'filter.difficulty': 'Difficulté',
                'filter.easy': 'Facile',
                'filter.moderate': 'Modéré',
                'filter.hard': 'Difficile',
                'filter.facilities': 'Installations',
                'filter.camping': 'Camping',
                'filter.hiking': 'Randonnée',
                'filter.fishing': 'Pêche',
                'filter.swimming': 'Natation',
                'filter.biking': 'Vélo',
                'filter.price': 'Gamme de prix',
                'filter.distance': 'Distance',
                'filter.reset': 'Réinitialiser les filtres',
                'filter.apply': 'Appliquer les filtres',

                // Payment
                'payment.title': 'Paiement',
                'payment.cardNumber': 'Numéro de carte',
                'payment.expiry': 'Date d\'expiration',
                'payment.cvc': 'CVC',
                'payment.cardholderName': 'Nom du titulaire',
                'payment.billingAddress': 'Adresse de facturation',
                'payment.pay': 'Payer maintenant',
                'payment.success': 'Paiement réussi',
                'payment.failed': 'Paiement échoué',

                // Messages
                'message.loading': 'Chargement...',
                'message.error': 'Une erreur s\'est produite',
                'message.success': 'Succès',
                'message.saved': 'Enregistré avec succès',
                'message.confirm': 'Êtes-vous sûr?',
                'message.noResults': 'Aucun résultat trouvé',
                'message.tryAgain': 'Réessayer',
                'message.back': 'Retour',
                'message.next': 'Suivant',
                'message.close': 'Fermer',

                // Footer
                'footer.about': 'À propos',
                'footer.contact': 'Contact',
                'footer.privacy': 'Politique de confidentialité',
                'footer.terms': 'Conditions d\'utilisation',
                'footer.copyright': '© 2026 Parcs de l\'Ontario. Tous droits réservés.'
            },
            'es': {
                // Header & Navigation
                'nav.home': 'Inicio',
                'nav.parks': 'Todos los Parques',
                'nav.booking': 'Reservar',
                'nav.account': 'Cuenta',
                'nav.admin': 'Administración',
                'nav.language': 'Idioma',
                'nav.logout': 'Cerrar Sesión',

                // Home Page
                'home.title': 'Parques de Ontario - Descubre la Naturaleza',
                'home.subtitle': 'Planifica tu aventura de camping perfecta en los hermosos parques de Ontario',
                'home.searchPlaceholder': 'Buscar parques por nombre',
                'home.search': 'Buscar',
                'home.featured': 'Parques Destacados',
                'home.viewDetails': 'Ver Detalles',
                'home.bookNow': 'Reservar Ahora',

                // Park Details
                'park.details': 'Detalles del Parque',
                'park.location': 'Ubicación',
                'park.description': 'Descripción',
                'park.facilities': 'Instalaciones',
                'park.difficulty': 'Dificultad',
                'park.rating': 'Calificación',
                'park.reviews': 'Reseñas',
                'park.availability': 'Disponibilidad',
                'park.checkIn': 'Entrada',
                'park.checkOut': 'Salida',
                'park.nights': 'Noches',
                'park.pricePerNight': 'Precio por noche',
                'park.totalPrice': 'Precio total',
                'park.reserve': 'Reservar',

                // Booking
                'booking.title': 'Reserva tu Estadía',
                'booking.guestName': 'Nombre del Huésped',
                'booking.email': 'Correo Electrónico',
                'booking.phone': 'Teléfono',
                'booking.checkInDate': 'Fecha de Entrada',
                'booking.checkOutDate': 'Fecha de Salida',
                'booking.campsiteType': 'Tipo de Campamento',
                'booking.specialRequests': 'Solicitudes Especiales',
                'booking.reviewBooking': 'Revisar Reserva',
                'booking.confirmBooking': 'Confirmar Reserva',
                'booking.bookingConfirmed': '¡Reserva Confirmada!',
                'booking.confirmationId': 'ID de Confirmación',
                'booking.checkEmail': 'Revisa tu correo electrónico para detalles de confirmación',

                // Account
                'account.profile': 'Perfil',
                'account.settings': 'Configuración',
                'account.bookingHistory': 'Historial de Reservas',
                'account.preferences': 'Preferencias',
                'account.logout': 'Cerrar Sesión',
                'account.editProfile': 'Editar Perfil',
                'account.changePassword': 'Cambiar Contraseña',
                'account.savedParks': 'Parques Guardados',
                'account.newsletter': 'Suscripción al Boletín',

                // Reviews
                'review.title': 'Reseñas y Calificaciones',
                'review.yourRating': 'Tu Calificación',
                'review.reviewTitle': 'Título de la Reseña',
                'review.reviewContent': 'Tu Reseña',
                'review.submit': 'Enviar Reseña',
                'review.helpful': 'Útil',
                'review.notHelpful': 'No Útil',
                'review.averageRating': 'Calificación Promedio',
                'review.totalReviews': 'Total de Reseñas',
                'review.filterBy': 'Filtrar por calificación',

                // Search & Filters
                'filter.difficulty': 'Dificultad',
                'filter.easy': 'Fácil',
                'filter.moderate': 'Moderado',
                'filter.hard': 'Difícil',
                'filter.facilities': 'Instalaciones',
                'filter.camping': 'Camping',
                'filter.hiking': 'Senderismo',
                'filter.fishing': 'Pesca',
                'filter.swimming': 'Natación',
                'filter.biking': 'Ciclismo',
                'filter.price': 'Rango de Precio',
                'filter.distance': 'Distancia',
                'filter.reset': 'Restablecer Filtros',
                'filter.apply': 'Aplicar Filtros',

                // Payment
                'payment.title': 'Pago',
                'payment.cardNumber': 'Número de Tarjeta',
                'payment.expiry': 'Fecha de Vencimiento',
                'payment.cvc': 'CVC',
                'payment.cardholderName': 'Nombre del Titular',
                'payment.billingAddress': 'Dirección de Facturación',
                'payment.pay': 'Pagar Ahora',
                'payment.success': 'Pago Exitoso',
                'payment.failed': 'Pago Fallido',

                // Messages
                'message.loading': 'Cargando...',
                'message.error': 'Ocurrió un error',
                'message.success': 'Éxito',
                'message.saved': 'Guardado exitosamente',
                'message.confirm': '¿Estás seguro?',
                'message.noResults': 'No se encontraron resultados',
                'message.tryAgain': 'Intentar de Nuevo',
                'message.back': 'Atrás',
                'message.next': 'Siguiente',
                'message.close': 'Cerrar',

                // Footer
                'footer.about': 'Acerca de',
                'footer.contact': 'Contacto',
                'footer.privacy': 'Política de Privacidad',
                'footer.terms': 'Términos de Servicio',
                'footer.copyright': '© 2026 Parques de Ontario. Todos los derechos reservados.'
            },
            'zh': {
                // Header & Navigation
                'nav.home': '首页',
                'nav.parks': '所有公园',
                'nav.booking': '预订',
                'nav.account': '账户',
                'nav.admin': '管理',
                'nav.language': '语言',
                'nav.logout': '登出',

                // Home Page
                'home.title': '安大略省公园 - 发现自然',
                'home.subtitle': '在安大略省美丽的公园中规划您完美的露营冒险',
                'home.searchPlaceholder': '按名称搜索公园',
                'home.search': '搜索',
                'home.featured': '精选公园',
                'home.viewDetails': '查看详情',
                'home.bookNow': '立即预订',

                // Park Details
                'park.details': '公园详情',
                'park.location': '位置',
                'park.description': '描述',
                'park.facilities': '设施',
                'park.difficulty': '难度',
                'park.rating': '评分',
                'park.reviews': '评论',
                'park.availability': '可用性',
                'park.checkIn': '入住',
                'park.checkOut': '退房',
                'park.nights': '晚数',
                'park.pricePerNight': '每晚价格',
                'park.totalPrice': '总价格',
                'park.reserve': '预订',

                // Booking
                'booking.title': '预订您的住宿',
                'booking.guestName': '客人姓名',
                'booking.email': '电子邮件',
                'booking.phone': '电话',
                'booking.checkInDate': '入住日期',
                'booking.checkOutDate': '退房日期',
                'booking.campsiteType': '营地类型',
                'booking.specialRequests': '特殊要求',
                'booking.reviewBooking': '审核预订',
                'booking.confirmBooking': '确认预订',
                'booking.bookingConfirmed': '预订已确认!',
                'booking.confirmationId': '确认号',
                'booking.checkEmail': '检查您的电子邮件以获取确认详情',

                // Account
                'account.profile': '个人资料',
                'account.settings': '设置',
                'account.bookingHistory': '预订历史',
                'account.preferences': '偏好',
                'account.logout': '登出',
                'account.editProfile': '编辑个人资料',
                'account.changePassword': '更改密码',
                'account.savedParks': '已保存的公园',
                'account.newsletter': '新闻通讯订阅',

                // Reviews
                'review.title': '评论和评分',
                'review.yourRating': '您的评分',
                'review.reviewTitle': '评论标题',
                'review.reviewContent': '您的评论',
                'review.submit': '提交评论',
                'review.helpful': '有帮助',
                'review.notHelpful': '没有帮助',
                'review.averageRating': '平均评分',
                'review.totalReviews': '总评论数',
                'review.filterBy': '按评分筛选',

                // Search & Filters
                'filter.difficulty': '难度',
                'filter.easy': '简单',
                'filter.moderate': '中等',
                'filter.hard': '困难',
                'filter.facilities': '设施',
                'filter.camping': '露营',
                'filter.hiking': '登山',
                'filter.fishing': '钓鱼',
                'filter.swimming': '游泳',
                'filter.biking': '自行车',
                'filter.price': '价格范围',
                'filter.distance': '距离',
                'filter.reset': '重置过滤器',
                'filter.apply': '应用过滤器',

                // Payment
                'payment.title': '付款',
                'payment.cardNumber': '卡号',
                'payment.expiry': '过期日期',
                'payment.cvc': 'CVC',
                'payment.cardholderName': '持卡人姓名',
                'payment.billingAddress': '账单地址',
                'payment.pay': '立即付款',
                'payment.success': '付款成功',
                'payment.failed': '付款失败',

                // Messages
                'message.loading': '加载中...',
                'message.error': '发生错误',
                'message.success': '成功',
                'message.saved': '保存成功',
                'message.confirm': '您确定吗?',
                'message.noResults': '未找到结果',
                'message.tryAgain': '重试',
                'message.back': '返回',
                'message.next': '下一个',
                'message.close': '关闭',

                // Footer
                'footer.about': '关于',
                'footer.contact': '联系',
                'footer.privacy': '隐私政策',
                'footer.terms': '服务条款',
                'footer.copyright': '© 2026 安大略省公园。版权所有。'
            }
        };
    }

    // Get translation by key
    t(key, defaultValue = key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return defaultValue;
            }
        }

        return value || defaultValue;
    }

    // Translate with parameters
    tp(key, params = {}, defaultValue = key) {
        let translation = this.t(key, defaultValue);

        Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(`{{${param}}}`, value);
        });

        return translation;
    }

    // Set language
    setLanguage(language) {
        if (this.supportedLanguages[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.updatePageContent();
            return true;
        }
        return false;
    }

    // Get current language
    getLanguage() {
        return this.currentLanguage;
    }

    // Get stored language or default to English
    getStoredLanguage() {
        return localStorage.getItem('language') || 'en';
    }

    // Get all supported languages
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    // Detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language.split('-')[0];
        return this.supportedLanguages[browserLang] ? browserLang : 'en';
    }

    // Update page content with current language
    updatePageContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } else {
                element.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        document.documentElement.lang = this.currentLanguage;

        if (window.gaManager) {
            window.gaManager.trackEvent('language_changed', {
                language: this.currentLanguage
            });
        }
    }

    // Render language selector
    renderLanguageSelector(containerId = 'language-selector') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="language-selector">';
        html += '<label>' + this.t('nav.language') + ':</label>';
        html += '<select id="language-select" class="language-select">';

        Object.entries(this.supportedLanguages).forEach(([code, data]) => {
            const selected = code === this.currentLanguage ? 'selected' : '';
            html += `<option value="${code}" ${selected}>${data.nativeName}</option>`;
        });

        html += '</select></div>';
        container.innerHTML = html;

        document.getElementById('language-select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
            this.updatePageContent();
        });
    }

    // Get right-to-left language status
    isRTL() {
        return false; // All supported languages are LTR
    }

    // Format number based on locale
    formatNumber(number) {
        const formatter = new Intl.NumberFormat(this.currentLanguage);
        return formatter.format(number);
    }

    // Format currency based on locale
    formatCurrency(amount, currency = 'CAD') {
        const formatter = new Intl.NumberFormat(this.currentLanguage, {
            style: 'currency',
            currency: currency
        });
        return formatter.format(amount);
    }

    // Format date based on locale
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(this.currentLanguage, options);
    }

    // Export translations for external use
    exportTranslations() {
        return this.translations;
    }

    // Import custom translations
    importTranslations(language, translations) {
        if (this.translations[language]) {
            this.translations[language] = {
                ...this.translations[language],
                ...translations
            };
        }
    }
}

const i18n = new I18nManager();
