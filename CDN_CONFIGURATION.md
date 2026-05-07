# CDN Configuration Guide - Ontario Parks

This guide covers CDN deployment and optimization for Ontario Parks website using AWS CloudFront or Cloudflare.

## Overview

The Ontario Parks website uses a CDN to:

- Serve static assets (CSS, JS, images) from edge locations
- Improve page load times globally
- Reduce server bandwidth costs
- Provide DDoS protection and security

## AWS CloudFront Configuration

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://ontario-parks-cdn --region us-east-1
```

### Step 2: Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EABC123"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ontario-parks-cdn/*"
    }
  ]
}
```

### Step 3: Create CloudFront Distribution

1. Go to CloudFront Console
2. Click "Create distribution"
3. Set Origin Domain: `ontario-parks-cdn.s3.amazonaws.com`
4. Set Origin Access: Use Origin Access Identity (OAI)
5. Enable Compress objects automatically
6. Set TTL values:
   - Default: 86400 (24 hours)
   - Max: 31536000 (1 year)
   - Min: 0

### Step 4: Cache Behaviors

Configure cache behaviors for different content types:

```
Path Pattern: *.js
TTL: 86400 (1 day)
Compress: Yes

Path Pattern: *.css
TTL: 86400 (1 day)
Compress: Yes

Path Pattern: *.jpg, *.png, *.webp
TTL: 2592000 (30 days)
Compress: Yes

Path Pattern: *.html
TTL: 3600 (1 hour)
Compress: Yes
```

### Step 5: Enable Caching Headers in HTML

Add versioning to static assets:

```html
<link rel="stylesheet" href="css/styles.css?v=1.0.0" />
<script src="js/script.js?v=1.0.0"></script>
<img src="images/park.jpg?v=1.0.0" alt="Park" />
```

### Step 6: Deploy Assets

```bash
# Upload CSS
aws s3 cp css/ s3://ontario-parks-cdn/css/ --recursive --cache-control "max-age=86400"

# Upload JS
aws s3 cp js/ s3://ontario-parks-cdn/js/ --recursive --cache-control "max-age=86400"

# Upload Images
aws s3 cp images/ s3://ontario-parks-cdn/images/ --recursive --cache-control "max-age=2592000"

# Upload HTML (shorter TTL)
aws s3 cp *.html s3://ontario-parks-cdn/ --cache-control "max-age=3600"
```

## Cloudflare Configuration

### Step 1: Add Domain

1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers

### Step 2: Configure Caching Rules

Caching Level: Cache Everything

```
By-pass Cache: /admin/*
            /api/*
            *.php
```

### Step 3: Set Page Rules

```
Priority 1: https://ontarioparks.com/api/* - Cache Level: Bypass
Priority 2: https://ontarioparks.com/*.css - Cache Level: Cache Everything, TTL: 1 month
Priority 3: https://ontarioparks.com/*.js - Cache Level: Cache Everything, TTL: 1 month
Priority 4: https://ontarioparks.com/*.jpg - Cache Level: Cache Everything, TTL: 1 year
Priority 5: https://ontarioparks.com/ - Cache Level: Cache Everything, TTL: 1 hour
```

### Step 4: Enable Performance Features

- Minify CSS/JS/HTML: Enable
- Browser Caching: 1 month
- Gzip Compression: Enable
- Brotli Compression: Enable

### Step 5: Configure DNS

Add these DNS records in Cloudflare:

```
Type    Name    Content        TTL
A       @       YOUR_IP        Auto
CNAME   www     example.com    Auto
CNAME   cdn     YOUR_IP        Auto
```

## Performance Optimization

### Asset Versioning Strategy

Update version in manifest when deploying:

```javascript
// manifest.json
{
  "version": "1.0.1",
  "assets": {
    "css": "/css/styles.css?v=1.0.1",
    "js": "/js/script.js?v=1.0.1"
  }
}
```

### Image Optimization

1. Use WebP format with JPEG fallback:

```html
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

2. Responsive images:

```html
<img
  srcset="image-small.jpg 480w, image-medium.jpg 800w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 480px,
            (max-width: 1024px) 800px,
            1200px"
  src="image-medium.jpg"
  alt="Park"
/>
```

### CSS/JS Minification

Minify and bundle assets:

```bash
# CSS
cssnano input.css output.min.css

# JavaScript
terser input.js -o output.min.js -c -m
```

## Monitoring

### CloudWatch Metrics

Monitor key metrics:

- BytesDownloaded
- BytesUploaded
- Requests
- 4xx Errors
- 5xx Errors

### Cloudflare Analytics

View real-time metrics:

- Requests/minute
- Cache hit ratio
- Bandwidth saved
- Top pages by requests

## Cache Invalidation

### CloudFront Invalidation

```bash
aws cloudfront create-invalidation \
  --distribution-id EABC123 \
  --paths "/*"
```

### Cloudflare Cache Purge

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "X-Auth-Email: {email}" \
  -H "X-Auth-Key: {api_key}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://example.com/css/styles.css"]}'
```

## Security Headers

Add these headers via CDN:

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

## Cost Optimization

- Monitor data transfer costs
- Use CloudFront regional caches
- Implement aggressive caching for static assets
- Use compression (gzip, brotli)
- Prune old versions after deploy

## Deployment Checklist

- [ ] Create CDN bucket/zone
- [ ] Configure origin settings
- [ ] Set cache behaviors
- [ ] Enable compression
- [ ] Add security headers
- [ ] Upload assets
- [ ] Test CDN URLs
- [ ] Update DNS records
- [ ] Monitor cache hit ratio
- [ ] Set up alerts
