// SEO Optimization Module
// Handles meta tags, structured data, and SEO improvements

class SEOOptimizer {
    constructor() {
        this.baseUrl = 'https://ontarioparks.com';
        this.siteName = 'Ontario Parks';
    }

    // Set page meta tags
    setPageMeta(config) {
        const { title, description, keywords, image, url } = config;

        // Update title
        if (title) {
            document.title = title;
            this.updateMetaTag('og:title', title);
            this.updateMetaTag('twitter:title', title);
        }

        // Update description
        if (description) {
            this.updateMetaTag('description', description);
            this.updateMetaTag('og:description', description);
            this.updateMetaTag('twitter:description', description);
        }

        // Update keywords
        if (keywords) {
            this.updateMetaTag('keywords', keywords);
        }

        // Update image
        if (image) {
            this.updateMetaTag('og:image', image);
            this.updateMetaTag('twitter:image', image);
        }

        // Update URL
        if (url) {
            this.updateMetaTag('og:url', url);
            this.updateCanonical(url);
        }

        // Default Open Graph settings
        this.updateMetaTag('og:site_name', this.siteName);
        this.updateMetaTag('og:type', 'website');
    }

    // Update or create meta tag
    updateMetaTag(name, content) {
        let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            const attr = name.startsWith('og:') ? 'property' : 'name';
            tag.setAttribute(attr, name);
            document.head.appendChild(tag);
        }

        tag.content = content;
    }

    // Update canonical URL
    updateCanonical(url) {
        let canonical = document.querySelector('link[rel="canonical"]');

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }

        canonical.href = url;
    }

    // Add JSON-LD structured data
    addStructuredData(type, data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type,
            ...data
        });
        document.head.appendChild(script);
    }

    // Organization structured data
    addOrganizationSchema() {
        this.addStructuredData('Organization', {
            name: 'Ontario Parks',
            url: this.baseUrl,
            logo: `${this.baseUrl}/images/logo.png`,
            description: 'Your guide to Ontario\'s provincial parks - camping, hiking, and nature experiences for first-time campers',
            sameAs: [
                'https://www.facebook.com/ontarioparks',
                'https://twitter.com/OntarioParks',
                'https://instagram.com/ontarioparks'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                telephone: '+1-416-555-0123',
                email: 'info@ontarioparks.com'
            }
        });
    }

    // Park schema for individual park pages
    addParkSchema(parkData) {
        this.addStructuredData('TouristAttraction', {
            name: parkData.name,
            description: parkData.description,
            url: parkData.url || `${this.baseUrl}/park-details.html`,
            image: parkData.image,
            address: {
                '@type': 'PostalAddress',
                addressLocality: parkData.city,
                addressRegion: parkData.province,
                addressCountry: 'CA'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: parkData.rating || 4.5,
                reviewCount: parkData.reviewCount || 0
            },
            amenityFeature: (parkData.amenities || []).map(amenity => ({
                '@type': 'LocationFeatureSpecification',
                name: amenity
            }))
        });
    }

    // Booking schema for checkout page
    addBookingSchema(bookingData) {
        this.addStructuredData('EventReservation', {
            reservationNumber: bookingData.confirmationId,
            reservationStatus: 'http://schema.org/ReservationConfirmed',
            underName: {
                '@type': 'Person',
                name: bookingData.guestName
            },
            reservationFor: {
                '@type': 'CampingPitch',
                name: bookingData.campsiteName,
                containedInPlace: {
                    '@type': 'CivicStructure',
                    name: bookingData.parkName
                },
                startDate: bookingData.checkIn,
                endDate: bookingData.checkOut
            },
            priceCurrency: 'CAD',
            price: bookingData.totalCost
        });
    }

    // Breadcrumb schema
    addBreadcrumbSchema(breadcrumbs) {
        const itemListElement = breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url || `${this.baseUrl}/${crumb.path || ''}`
        }));

        this.addStructuredData('BreadcrumbList', {
            itemListElement
        });
    }

    // FAQ schema
    addFAQSchema(faqs) {
        const mainEntity = faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }));

        this.addStructuredData('FAQPage', {
            mainEntity
        });
    }

    // Generate sitemap
    generateSitemap(pages) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
    <url>
        <loc>${page.url}</loc>
        <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq || 'weekly'}</changefreq>
        <priority>${page.priority || 0.8}</priority>
    </url>
`).join('')}
</urlset>`;

        return sitemap;
    }

    // Generate robots.txt
    generateRobots() {
        return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /private

Sitemap: https://ontarioparks.com/sitemap.xml
Crawl-delay: 1`;
    }

    // Social media optimization
    addSocialMeta(config) {
        const { title, description, image, twitterHandle } = config;

        // Open Graph
        this.updateMetaTag('og:title', title);
        this.updateMetaTag('og:description', description);
        this.updateMetaTag('og:image', image);
        this.updateMetaTag('og:type', 'website');

        // Twitter Card
        this.updateMetaTag('twitter:card', 'summary_large_image');
        this.updateMetaTag('twitter:title', title);
        this.updateMetaTag('twitter:description', description);
        this.updateMetaTag('twitter:image', image);
        if (twitterHandle) {
            this.updateMetaTag('twitter:creator', twitterHandle);
        }
    }

    // Set hreflang for multilingual content
    addHrefLang(translations) {
        // Remove existing hreflang tags
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => {
            tag.remove();
        });

        // Add new hreflang tags
        Object.entries(translations).forEach(([lang, url]) => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = lang;
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // Set viewport for mobile
    setViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
            document.head.appendChild(meta);
        }
    }

    // Set theme color
    setThemeColor(color = '#059669') {
        const theme = document.querySelector('meta[name="theme-color"]');
        if (theme) {
            theme.content = color;
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = color;
            document.head.appendChild(meta);
        }
    }

    // Optimize heading hierarchy
    validateHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const hierarchy = Array.from(headings).map(h => parseInt(h.tagName[1]));

        let isValid = true;
        for (let i = 1; i < hierarchy.length; i++) {
            if (hierarchy[i] - hierarchy[i - 1] > 1) {
                console.warn('Heading hierarchy issue:', hierarchy);
                isValid = false;
            }
        }

        return isValid;
    }

    // Generate meta robots tag
    setRobots(rules = 'index, follow') {
        this.updateMetaTag('robots', rules);
    }

    // Add DNS prefetch
    addDNSPrefetch(domains) {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    // Add preconnect
    addPreconnect(domains) {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }
}

// Initialize globally
const seoOptimizer = new SEOOptimizer();
