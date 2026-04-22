# Dr. Herlon Moura Medical Website Redesign

A premium, high-performance medical website for Dr. Herlon Moura, a specialist in angiology and vascular surgery in Salvador, Brazil.

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Quality**: ESLint and Prettier
- **Deployment**: Optimized for Vercel or AWS

## Project Structure

```
herlon-moura-website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

The development server will start at `http://localhost:3000`.

## Design System

### Colors

- **Primary Background**: Dark Mode Elevated (#0F172A)
- **Primary Accent**: Surgical Teal (#14B8A6)
- **Supporting Colors**: Neutral Light, Medium, Dark, Success Green, Warning Amber, Error Red

### Typography

- **Display Large**: 48px / 700 weight
- **Display Medium**: 36px / 700 weight
- **Heading 1-3**: 32px-20px / 600 weight
- **Body Large/Regular/Small**: 18px-14px / 400 weight
- **Caption**: 12px / 500 weight

### Responsive Breakpoints

- **Mobile**: 320px
- **Tablet**: 641px
- **Desktop**: 1025px
- **Ultra-wide**: 1441px

## Key Features

- ✅ Premium dark mode design with glassmorphism effects
- ✅ Fully responsive across all devices (320px-2560px)
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Core Web Vitals optimization (LCP <2.5s, FID <100ms, CLS <0.1)
- ✅ TypeScript strict mode for type safety
- ✅ ESLint and Prettier for code quality
- ✅ Optimized images with WebP support
- ✅ SEO-friendly with structured data

## Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600 milliseconds
- **Animation Performance**: 60 FPS

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- Color contrast ratios ≥ 4.5:1
- Reduced motion support

## Security

- HTTPS encryption
- CSRF protection
- Security headers configured
- No sensitive data persistence

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Use semantic HTML
- Implement accessibility features

### Component Development

- Create reusable components in `/components`
- Use Tailwind CSS for styling
- Implement proper TypeScript types
- Add accessibility attributes
- Test responsive behavior

### Testing

- Unit tests for components
- Property-based tests for core logic
- Accessibility testing
- Performance testing

## Deployment

The project is optimized for deployment on:

- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **AWS EC2 with Docker**
- **Other Node.js hosting platforms**

## License

Proprietary - Dr. Herlon Moura Medical Practice

## Contact

For questions or support, contact the development team.
