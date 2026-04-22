# Deployment Guide: Cloudflare Pages

This guide walks through deploying the Dr. Herlon Moura website to Cloudflare Pages.

## Prerequisites

- Cloudflare account with Pages enabled
- GitHub account with repository access
- Node.js 20+ installed locally

## Setup Steps

### 1. Create Cloudflare Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub and select the `herlon-moura-website` repository
5. Click **Begin setup**

### 2. Configure Build Settings

In the Cloudflare Pages setup:

- **Project name**: `herlon-moura-website`
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `.next/standalone`
- **Root directory**: `herlon-moura-website` (if monorepo)

### 3. Environment Variables

Add these environment variables in Cloudflare Pages settings:

```
NODE_VERSION=20
```

### 4. GitHub Secrets (for CI/CD)

Add these secrets to your GitHub repository:

1. `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - Get from: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Permissions: Account.Pages (Edit)

2. `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID
   - Get from: Cloudflare Dashboard → Pages → Project → Settings

### 5. Domain Configuration

To connect your custom domain `herlonmoura.com.br`:

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add `herlonmoura.com.br`
4. Follow DNS setup instructions
5. Update your domain registrar nameservers to Cloudflare

### 6. Deploy

#### Automatic Deployment (Recommended)

Push to `main` branch:
```bash
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run tests
2. Build the Next.js app
3. Deploy to Cloudflare Pages

#### Manual Deployment

Using Wrangler CLI:

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler pages deploy .next/standalone --project-name=herlon-moura-website
```

## Verification

After deployment:

1. Check deployment status in Cloudflare Pages dashboard
2. Visit your deployment URL (e.g., `https://herlon-moura-website.pages.dev`)
3. Verify all pages load correctly
4. Test responsive design on mobile
5. Check Core Web Vitals in PageSpeed Insights

## Performance Optimization

Cloudflare Pages automatically provides:

- **Global CDN**: Content served from edge locations worldwide
- **Automatic HTTPS**: SSL/TLS certificates managed
- **Caching**: Static assets cached at edge
- **Compression**: Automatic gzip/brotli compression
- **HTTP/2**: Modern protocol support

## Monitoring

Monitor your deployment:

1. **Analytics**: Cloudflare Pages → Analytics
2. **Logs**: Check deployment logs for errors
3. **Performance**: Use Cloudflare Analytics Engine
4. **Uptime**: Set up uptime monitoring

## Rollback

To rollback to a previous deployment:

1. Go to Cloudflare Pages project
2. Click **Deployments**
3. Find the previous deployment
4. Click **Rollback to this deployment**

## Troubleshooting

### Build Fails

- Check build logs in Cloudflare Pages
- Verify `npm run build` works locally
- Ensure all dependencies are in `package.json`

### Pages Not Loading

- Check DNS configuration
- Verify custom domain is properly configured
- Clear browser cache
- Check Cloudflare firewall rules

### Performance Issues

- Check Core Web Vitals
- Optimize images (already done with Next.js Image)
- Review Cloudflare cache settings
- Check for large JavaScript bundles

## Next Steps

1. Set up monitoring and alerts
2. Configure custom error pages
3. Set up analytics tracking
4. Configure email notifications for deployments
5. Plan for regular updates and maintenance

## Support

For issues:
- Cloudflare Support: https://support.cloudflare.com
- Next.js Docs: https://nextjs.org/docs
- GitHub Actions: https://docs.github.com/en/actions
