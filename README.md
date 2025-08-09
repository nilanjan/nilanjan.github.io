# Nilanjan Goswami - Professional Portfolio

A modern, high-performance professional portfolio website built with **React** (frontend) and **Rust** (backend), showcasing expertise in graphics architecture, mobile GPU development, research contributions, and patent portfolio.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Sleek design with smooth animations using Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Performance Optimized**: Fast loading with Vite build tooling
- **Type Safety**: Full TypeScript implementation with shared types

### Backend (Rust + Axum)
- **High Performance**: Rust-powered API with Axum web framework
- **Type Safety**: Shared types between frontend and backend
- **CORS Enabled**: Cross-origin resource sharing for development
- **Structured Logging**: Comprehensive logging with tracing
- **Error Handling**: Robust error handling with proper HTTP status codes

### Key Sections
- **Hero Section**: Professional introduction with animated gradients
- **About Section**: Career overview and professional expertise
- **Experience Section**: Detailed work history at major tech companies (Qualcomm, NVIDIA, Intel)
- **Patents Section**: Comprehensive patent portfolio (4 granted, 4 pending)
- **Publications Section**: Research publications and academic contributions (15+ papers)
- **Skills Section**: Technical expertise across graphics architecture domains
- **Contact Section**: Professional networking and collaboration opportunities
- **Footer**: Professional links and navigation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Rust** with Axum web framework
- **Serde** for JSON serialization
- **Tower HTTP** for CORS and middleware
- **Tracing** for structured logging

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting

## 📁 Project Structure

```
ng_web/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── PatentsSection.tsx
│   │   │   ├── PublicationsSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── App.tsx          # Main application component
│   │   ├── main.tsx         # Application entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── backend/                  # Rust backend application
│   ├── src/
│   │   └── main.rs          # Backend server implementation
│   └── Cargo.toml           # Rust dependencies
├── shared/                   # Shared types and utilities
│   └── types.ts             # TypeScript interfaces
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ng_web
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Rust dependencies**
   ```bash
   cd ../backend
   cargo build
   ```

### Development

1. **Start the Rust backend**
   ```bash
   cd backend
   cargo run
   ```
   The backend will be available at `http://localhost:3001`

2. **Start the React frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the portfolio

### Building for Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build the backend**
   ```bash
   cd backend
   cargo build --release
   ```

## 🌐 API Endpoints

### Backend API (Port 3001)

- `GET /health` - Health check endpoint
- `POST /api/contact` - Submit contact form for professional inquiries

### Example API Response
```json
{
  "success": true,
  "data": "Message received successfully!",
  "message": "Thank you for your message. I'll get back to you soon!"
}
```

## 🎨 Customization

### Colors and Theme
- Edit `frontend/tailwind.config.js` to modify the color scheme
- Update `frontend/src/index.css` for custom component styles

### Content
- Update professional experience in `frontend/src/components/ExperienceSection.tsx`
- Modify patent information in `frontend/src/components/PatentsSection.tsx`
- Update publications in `frontend/src/components/PublicationsSection.tsx`
- Update contact information and social links

### Styling
- All styles use Tailwind CSS classes
- Custom animations are defined in the Tailwind config
- Component-specific styles are in `index.css`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cargo run            # Run development server
cargo build          # Build for development
cargo build --release # Build for production
cargo test           # Run tests
```

## 🚀 Deployment

### Frontend Deployment
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment

### Backend Deployment
- **Fly.io**: Deploy with `fly deploy`
- **Railway**: Connect GitHub repository
- **Docker**: Build and deploy containerized application

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Website Features

### Professional Showcase
- **Experience Timeline**: Comprehensive work history at Qualcomm, NVIDIA, and Intel
- **Patent Portfolio**: 8+ patents (4 granted, 4 pending) in graphics architecture
- **Research Publications**: 15+ peer-reviewed papers in top-tier venues
- **Technical Expertise**: Interactive skills showcase across graphics domains

### Professional Focus
- Graphics architecture and mobile GPU optimization
- AR/VR rendering and real-time graphics
- Research contributions and patent innovations
- Industry expertise and thought leadership

## 📞 Contact

- **LinkedIn**: [Nilanjan Goswami](https://linkedin.com/in/nilanjan-goswami)
- **GitHub**: [nilanjan](https://github.com/nilanjan)
- **Google Scholar**: [Research Profile](https://scholar.google.com/citations?user=-ZvEn44AAAAJ&hl=en)
- **Website**: [http://nilanjan.github.io/](http://nilanjan.github.io/)
- **Email**: nilanjan.goswami@gmail.com
- **Location**: Livermore, CA

---

Built with ❤️ using React, Rust, and modern web technologies. 