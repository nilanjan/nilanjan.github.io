# Deployment Guide for nilanjan.github.io

This guide will help you deploy your portfolio website to GitHub Pages at `https://nilanjan.github.io`.

## 🚀 Prerequisites

1. **GitHub Repository**: Ensure your code is in a GitHub repository
2. **Repository Name**: The repository should be named `nilanjan.github.io` for user pages, or you can use any repository name for project pages
3. **Git Setup**: Make sure you have git configured and can push to GitHub

## 📋 Deployment Methods

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

This method automatically builds and deploys your site when you push to the main branch.

#### Steps:

1. **Ensure you have the GitHub Actions workflow**:
   - The file `.github/workflows/deploy.yml` is already created
   - This workflow will automatically trigger on pushes to main branch

2. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add portfolio website"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your site

4. **Access your website**:
   - Your site will be available at `https://nilanjan.github.io`
   - It may take a few minutes for the first deployment

### Method 2: Manual Deployment with gh-pages

#### Steps:

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Deploy manually**:
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** (if not already done):
   - Go to repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select the `gh-pages` branch
   - Click Save

## 🔧 Configuration Details

### Frontend-Only Deployment

Since GitHub Pages only serves static files, we're deploying only the frontend React application. The backend API calls will need to be handled differently in production.

### Build Configuration

- **Build Output**: `frontend/dist/`
- **Base URL**: `/` (root domain)
- **Assets**: Properly configured for GitHub Pages

### Environment Considerations

- The website is configured to work without the Rust backend
- Contact form will need a different backend service (like Netlify Forms, Formspree, or your own API)
- All paths are configured for the root domain

## 🌐 Domain Setup

### Using nilanjan.github.io

If your repository is named `nilanjan.github.io`:
- Your site will automatically be available at `https://nilanjan.github.io`
- No additional configuration needed

### Using a Custom Domain

If you want to use a custom domain:

1. **Add CNAME file**:
   ```bash
   echo "yourdomain.com" > frontend/public/CNAME
   ```

2. **Configure DNS**:
   - Add a CNAME record pointing to `nilanjan.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Update repository settings**:
   - Go to Settings → Pages
   - Add your custom domain

## 🚨 Important Notes

### Backend Considerations

Since GitHub Pages only serves static files:

1. **Contact Form**: You'll need to:
   - Use a service like Formspree, Netlify Forms, or EmailJS
   - Or deploy the Rust backend separately (Vercel, Railway, Fly.io)

2. **API Calls**: Update the frontend to:
   - Remove backend dependencies for production
   - Use static data or external APIs

### Repository Structure

Your repository should be structured as:
```
nilanjan.github.io/
├── .github/workflows/deploy.yml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/ (not deployed)
├── README.md
└── DEPLOYMENT.md
```

## 🔄 Updating Your Site

To update your deployed website:

1. **Make changes locally**
2. **Test your changes**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **Build and test**:
   ```bash
   npm run build
   npm run preview
   ```
4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

The GitHub Action will automatically deploy your changes.

## 🛠️ Troubleshooting

### Build Failures
- Check the Actions tab in your GitHub repository
- Look for TypeScript or build errors
- Ensure all dependencies are properly installed

### Site Not Loading
- Check if GitHub Pages is enabled in repository settings
- Verify the source is set correctly (GitHub Actions or gh-pages branch)
- Wait a few minutes for DNS propagation

### Contact Form Issues
- The current contact form won't work without a backend
- Consider using Formspree or similar service
- Update the form action URL accordingly

## 📞 Need Help?

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your repository settings
3. Ensure all files are pushed to the main branch
4. Check GitHub Pages documentation for the latest updates
