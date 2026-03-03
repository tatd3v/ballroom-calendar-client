# 🎭 Ballroom Colombia - Frontend

Modern React frontend for the Ballroom Colombia event calendar platform with bilingual support, real-time translations, and PWA capabilities.

## ✨ Features

### 🎯 Core Functionality

- **📅 Interactive Calendar**: Monthly, weekly, and list views with FullCalendar
- **🏙️ City-Based Filtering**: Events organized by Colombian cities (Bogotá, Cali, Medellín, Ibagué)
- **👥 Role-Based Access**: Admins manage all events, organizers manage their city only
- **📱 Mobile-First PWA**: Responsive design with offline support
- **🌍 Bilingual Support**: Spanish/English with real-time translation
- **🖼️ Image Uploads**: Cloudinary integration for event images
- **🎨 Dynamic Theming**: Light/dark mode with city-based color coding

## 🏗️ Architecture

### Frontend Structure

```
transmarical/
├── src/
│   ├── components/
│   │   ├── Layout.jsx           # App shell with navigation
│   │   ├── EventCalendar.jsx    # FullCalendar wrapper
│   │   ├── CityFilter.jsx        # City filtering UI
│   │   └── EventModal.jsx       # Event details modal
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── EventContext.jsx     # Events + translation logic
│   │   └── ThemeContext.jsx     # Theme management
│   ├── pages/
│   │   ├── CalendarPage.jsx     # Main calendar view
│   │   ├── AdminPage.jsx        # Event management with image upload
│   │   └── LoginPage.jsx        # Authentication
│   ├── services/
│   │   ├── api.js               # API client
│   │   └── translationService.js # Event translation logic
│   ├── locales/
│   │   ├── en.js                # English translations
│   │   └── es.js                # Spanish translations
│   └── lib/
│       └── cloudinary.js        # Image upload utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Backend API running (see transmarical-server README)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
# Frontend runs on http://localhost:5173
# API should run on http://localhost:3001
```

### 3. Build for Production

```bash
npm run build:prod
npm run preview
```

## 🌍 Internationalization

### Supported Languages

- **Spanish (es)** - Primary language (source)
- **English (en)** - Auto-translated

### Translation Features

- **Real-time**: Automatic translation when switching languages
- **Smart Caching**: Translations cached to avoid repeated API calls
- **Fallback**: Original Spanish text if translation fails

## 🔧 Tech Stack

- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **FullCalendar**: Calendar component library
- **React Router**: Client-side routing
- **i18next**: Internationalization framework
- **Lucide React**: Icon library

## 📊 Performance

### Optimization Features

- **Image Lazy Loading**: Load images as needed
- **API Response Caching**: Reduce database queries
- **Bundle Splitting**: Optimize JavaScript delivery
- **Service Worker**: Offline caching strategy

## 🔌 API Integration

### Endpoints Used

- `GET /api/events` - Fetch all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/upload-image` - Upload image
- `POST /api/auth/login` - Authentication

### API Configuration

```javascript
// Uses relative URLs for Vercel rewrites
const API_URL = '/api';

// Requests go through Vercel rewrites to HTTPS backend
```

## 🚀 Deployment

### Vercel Deployment

#### Prerequisites

- Vercel account
- Connected Git repository
- Backend API deployed on EC2

#### Configuration Files

#### vercel.json

```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-server-ip/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Deployment Steps

```bash
# 1. Build for production
npm run build:prod

# 2. Deploy to Vercel
vercel --prod

# 3. Configure environment variables in Vercel dashboard
# (No VITE_BACKEND_URL needed - uses rewrites)
```

#### Environment Setup

- **Development**: Uses `/api` relative URLs
- **Production**: Vercel rewrites handle API routing
- **No mixed content**: All requests go through HTTPS rewrites

## 🐛 Troubleshooting

### Common Issues

#### API Not Working

```bash
# Check Vercel rewrites are working
curl https://your-app.vercel.app/api/events

# Check backend is accessible
curl https://your-server-ip/api/events
```

#### Mixed Content Errors

- Ensure backend uses HTTPS
- Check Vercel rewrites configuration
- Verify no hardcoded HTTP URLs

#### Translation Not Working

1. Check network connectivity
2. Verify translation service API
3. Clear browser cache
4. Check console for errors

#### Images Not Loading

1. Verify Cloudinary configuration
2. Check image URLs in network tab
3. Validate file format/size
4. Check API authentication

#### PWA Issues

1. Clear service worker cache
2. Rebuild PWA assets
3. Check manifest.json configuration
4. Verify HTTPS for production

## 📱 Mobile Optimization

### Responsive Breakpoints

```css
/* Tailwind responsive utilities */
sm: 640px   /* Small phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
```

### Touch Interactions

- Swipe gestures for calendar navigation
- Touch-friendly button sizes
- Optimized form inputs for mobile
- Haptic feedback support

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Sanitization**: XSS prevention
- **HTTPS Required**: Production security
- **Content Security Policy**: Header-based protection
- **Secure Storage**: Sensitive data in localStorage with encryption

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Follow code style (ESLint + Prettier)
4. Test on mobile devices
5. Submit Pull Request

## 📄 License

MIT License - Free for non-profit and educational use

---

Made with ❤️ for the Colombian Ballroom Scene
