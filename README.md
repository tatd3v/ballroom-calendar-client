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

### 🚀 Technical Features
- **Real-Time Translation**: Auto-translation of event titles and descriptions
- **Smart Caching**: LocalStorage + PWA service worker for offline access
- **Image Optimization**: Cloudinary auto-optimization and delivery
- **Component Architecture**: Context-based state management

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
npm run build
npm run preview
```

## 📱 PWA Features

- **Offline Support**: Service worker caching
- **Installable**: Add to home screen
- **Responsive**: Works on all devices
- **Fast Loading**: Optimized bundle size

## 🌍 Internationalization

### Supported Languages
- **Spanish (es)** - Primary language (source)
- **English (en)** - Auto-translated

### Translation Features
- **Real-time**: Automatic translation when switching languages
- **Smart Caching**: Translations cached to avoid repeated API calls
- **Fallback**: Original Spanish text if translation fails

### Adding New Languages
1. Add translation file: `src/locales/[lang].js`
2. Update `i18n.js` configuration
3. Add language option to theme switcher

## 🎨 City Color Scheme

```javascript
const CITY_COLORS = {
  Bogota: '#EE0087',    // Magenta
  Cali: '#F15A24',      // Orange  
  Medellin: '#BEDF3F',  // Lime
  Ibague: '#D6D0F8'     // Lavender
}
```

## 🔧 Development

### Tech Stack
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **FullCalendar**: Calendar component library
- **React Router**: Client-side routing
- **i18next**: Internationalization framework
- **Lucide React**: Icon library

### Key Components

#### EventContext.jsx
- **State Management**: Events, translations, caching
- **Real-time Translation**: Auto-translates events on language change
- **Smart Caching**: LocalStorage with expiration
- **API Integration**: CRUD operations with error handling

#### AdminPage.jsx
- **Event Management**: Create, edit, delete events
- **Image Upload**: Cloudinary integration with preview
- **Form Validation**: Client-side validation
- **Responsive Design**: Mobile-friendly forms

#### EventCalendar.jsx
- **Calendar Views**: Month, week, list, day views
- **Event Rendering**: City-based colors
- **Interactions**: Click events for details
- **Localization**: Date/time formatting

## 📊 Performance

### Optimization Features
- **Image Lazy Loading**: Load images as needed
- **API Response Caching**: Reduce database queries
- **Bundle Splitting**: Optimize JavaScript delivery
- **Service Worker**: Offline caching strategy

### Cache Strategy
```javascript
// LocalStorage caching with expiration
const CACHE_DURATION = 3600000 // 1 hour
localStorage.setItem('calendar_events_cache', JSON.stringify(data))
localStorage.setItem('calendar_events_cache_time', Date.now().toString())
```

## 🔌 API Integration

### Endpoints Used
- `GET /api/events` - Fetch all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/upload-image` - Upload image
- `POST /api/auth/login` - Authentication

### Error Handling
```javascript
try {
  const data = await eventsApi.getAll()
  setEvents(data)
} catch (error) {
  // Fallback to cache or show error
  handleApiError(error)
}
```

## 🎯 Features Deep Dive

### Real-Time Translation System
```javascript
// Auto-translate when language changes
useEffect(() => {
  const translateEvents = async () => {
    if (currentLang === SOURCE_LANG || rawEvents.length === 0) {
      setTranslatedEvents(rawEvents)
      return
    }
    
    setTranslating(true)
    const translated = await translateEvents(rawEvents, SOURCE_LANG, currentLang)
    setTranslatedEvents(translated)
    setTranslating(false)
  }
  
  translateEvents()
}, [currentLang, rawEvents])
```

### Image Upload Flow
```javascript
// 1. File validation (type, size)
// 2. Upload to Cloudinary
// 3. Get secure URL
// 4. Store URL in event data
// 5. Display preview

const handleImageUpload = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  
  const response = await fetch('/api/events/upload-image', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  
  const result = await response.json()
  setFormData({ ...formData, imageUrl: result.imageUrl })
}
```

### Authentication Flow
```javascript
// JWT token management
const login = async (credentials) => {
  const response = await authApi.login(credentials)
  localStorage.setItem('token', response.token)
  setUser(response.user)
}

// Protected API calls
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  })
}
```

## 🐛 Troubleshooting

### Common Issues

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

#### Calendar Not Updating
1. Check API connection
2. Clear localStorage cache
3. Verify event data format
4. Check browser console for errors

## 🚀 Deployment

### Frontend Deployment (Static Hosting)

#### Netlify (Recommended)
```bash
# Build for production
npm run build

# Deploy dist folder to Netlify
# 1. Connect repository to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: dist
# 4. Add environment variables:
#    - VITE_API_URL=https://your-domain.com/api

# Deploy using Netlify CLI (optional)
npm install -g netlify-cli
netlify login
netlify link
netlify deploy --prod --dir=dist
```

#### Alternative Static Hosting
```bash
# Other options for static hosting:
# - Vercel: vercel --prod
# - GitHub Pages: gh-pages branch
# - Cloudflare Pages: wrangler pages deploy dist
```

### Backend Deployment (Docker + EC2)

#### Prerequisites
- AWS EC2 instance (Ubuntu 20.04+)
- Docker & Docker Compose installed
- Domain name (optional)
- SSL certificate (optional)

#### Step 1: Build Docker Image Locally
```bash
# Navigate to server directory
cd transmarical-server

# Build Docker image
docker build -t ballroom-api:latest .
```

#### Step 2: Push to Container Registry

**Option A: Docker Hub**
```bash
# Tag image
docker tag ballroom-api:latest yourusername/ballroom-api:latest

# Login and push
docker login
docker push yourusername/ballroom-api:latest
```

**Option B: AWS ECR (Recommended)**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag ballroom-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/ballroom-api:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/ballroom-api:latest
```

#### Step 3: Configure EC2 Instance
```bash
# Connect to EC2
ssh -i "your-key.pem" ec2-user@3.131.85.173

# Create project directory
mkdir -p /home/ec2-user/ballroom-calendar
cd /home/ec2-user/ballroom-calendar

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api

  api:
    image: yourusername/ballroom-api:latest
    environment:
      - DATABASE_URL=postgresql://admin_db:R051t@16@postgres:5432/ballroom_colombia
      - JWT_SECRET=your-super-secret-jwt-key
      - CLOUDINARY_CLOUD_NAME=your-cloud-name
      - CLOUDINARY_API_KEY=your-api-key
      - CLOUDINARY_API_SECRET=your-api-secret
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=ballroom_colombia
      - POSTGRES_USER=admin_db
      - POSTGRES_PASSWORD=R051t@16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
EOF

# Create nginx configuration
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3001;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Frontend static files (Netlify)
        location / {
            proxy_pass https://ballroom-kunty-cal.netlify.app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # API routes
        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # API documentation
        location /api-docs {
            proxy_pass http://api;
            proxy_set_header Host $host;
        }
    }
}
EOF
```

#### Step 4: Deploy to EC2
```bash
# Pull latest image
docker-compose pull api

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs api
```

#### Step 5: Configure DNS & SSL
```bash
# Update DNS A-record to point to EC2 IP
# Install SSL certificate with Let's Encrypt

sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew SSL
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Step 6: Verify Deployment
```bash
# Test API health
curl http://localhost:3001/api/health

# Test from external
curl https://your-domain.com/api/health

# Check nginx status
sudo systemctl status nginx
```

### Alternative: Direct Git Deploy (Simpler)

If you want to skip container registry:

```bash
# On EC2
cd /home/ec2-user/ballroom-calendar

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build api
docker-compose up -d
```

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://admin_db:R051t@16@postgres:5432/ballroom_colombia"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3001
NODE_ENV=production

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### Frontend (.env)
```bash
# Production
VITE_API_URL=https://your-domain.com/api

# Development
VITE_API_URL=/api
```

### Deployment Checklist

- [ ] Frontend built and deployed
- [ ] Backend Docker image pushed
- [ ] EC2 security groups configured (ports 80, 443, 22)
- [ ] DNS records updated
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database initialized
- [ ] API health check passing
- [ ] Frontend API calls working
- [ ] Image upload functionality tested

### Monitoring & Maintenance

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f api

# Restart services
docker-compose restart

# Update image
docker-compose pull && docker-compose up -d

# Backup database
docker-compose exec postgres pg_dump -U admin_db ballroom_colombia > backup.sql
```

### Troubleshooting

#### Container Won't Start
```bash
# Check logs
docker-compose logs api

# Check environment variables
docker-compose config

# Rebuild image
docker-compose build --no-cache api
```

#### Database Connection Issues
```bash
# Test database connection
docker-compose exec postgres psql -U admin_db -d ballroom_colombia

# Check network
docker network ls
docker network inspect ballroom-calendar_default
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx config
sudo nginx -t
```

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

## 📈 Analytics & Monitoring

### Performance Metrics
```javascript
// Core Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Error Tracking
```javascript
// Global error boundary
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // Send to error tracking service
})
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/name`
3. Follow code style (ESLint + Prettier)
4. Test on mobile devices
5. Submit Pull Request

## 📄 License

MIT License - Free for non-profit and educational use

---

**🎭 Made with ❤️ for the Colombian Ballroom Dance Community**
