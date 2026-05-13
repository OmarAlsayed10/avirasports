import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      // ─── Colors ───────────────────────────────────────────────────────────────
      colors: {
        // Brand / Primary
        primary: {
          DEFAULT: '#111111', // Hero bg, nav pill, headings, dominant dark
          btn: '#6DDE26',     // CTA buttons, green accent
        },
        // Accent
        sale: '#dc2626',           // Sale / discounted prices
        'color-error': '#e10000',  // Required field asterisks
        success: '#39c869',        // "In Stock" badge

        // Backgrounds
        'bg-page': '#f5f5f3',      // Page / body background
        'bg-white': '#f5f5f3',
        'bg-dark': '#111111',      // Footer, hero, nav pill
        'bg-surface': '#1a1a1a',   // Surface-dark cards / elevated elements

        // Text
        'text-primary': '#111111',
        'text-body': '#1a1a1a',
        'text-secondary': '#565656',
        'text-placeholder': '#a6a6a6',
        'text-placeholder-alt': '#8c8c8c',
        'text-muted': '#545454',
        'text-near-black': '#111111',
        'text-on-dark': '#f5f5f3',        // Text on dark/hero sections
        'text-footer-link': '#d1d1d1',    // Muted links in dark sections

        // Borders
        'border-primary': '#111111',
        'border-input': '#111111',
        'border-footer': '#2a2a2a',       // Subtle separator on dark footer

        // Carousel
        'indicator-inactive': '#d9d9d9',

        // Shadcn/UI semantic aliases
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────────
      fontFamily: {
        primary: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        secondary: ['var(--font-barlow-condensed)', 'Barlow Condensed', 'sans-serif'],
        display: ['var(--font-barlow-condensed)', 'Barlow Condensed', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },

      fontSize: {
        'xs':             ['0.75rem',    { lineHeight: 'normal' }],
        'sm':             ['0.9375rem',  { lineHeight: 'normal' }],
        'base':           ['1rem',       { lineHeight: 'normal' }],
        'md':             ['1.0625rem',  { lineHeight: 'normal' }],
        'footer-copy':    ['0.875rem',   { lineHeight: '1.5' }],
        'price-range':    ['1.25rem',    { lineHeight: 'normal' }],
        'nav-sm':         ['0.9375rem',  { lineHeight: 'normal' }],
        'newsletter-sub': ['1.125rem',   { lineHeight: '1.6' }],
        'card':           ['1rem',       { lineHeight: 'normal' }],
        'category-label': ['1.125rem',   { lineHeight: 'normal' }],
        'checkout-field': ['2.1875rem',  { lineHeight: 'normal' }],
        'detail-title':   ['1.875rem',   { lineHeight: 'normal' }],
        'tab':            ['1.25rem',    { lineHeight: 'normal' }],
        'order-notes':    ['3.125rem',   { lineHeight: 'normal' }],
        'section-heading':['1.75rem',    { lineHeight: 'normal' }],
        'place-order':    ['3.75rem',    { lineHeight: 'normal' }],
        'page-heading':   ['2.5rem',     { lineHeight: 'normal' }],
      },

      fontWeight: {
        extralight: '200',
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
      },

      letterSpacing: {
        price: '3.75px',
        strike: '3.06px',
        'checkout-price': '4.5px',
        'checkout-total': '6px',
        stepper: '8.25px',
      },

      lineHeight: {
        'newsletter': '136.5%',
        'footer-desc': '1.507',
        'detail-body': '60px',
      },

      // ─── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        'btn-sm':    '4px',
        'tag':       '10px',
        'carousel':  '15px',
        'nav':       '20px',
        'card-sm':   '30px',
        'card-lg':   '40px',
        'input':     '50px',
        'stepper':   '60px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ─── Spacing & Layout ─────────────────────────────────────────────────────
      spacing: {
        'content': '1330px',
        'content-inset': '55px',
        'nav-bar': '1200px',
        'sidebar': '333px',
        'icon-label': '10px',
        'footer-link': '36px',
        'social': '40px',
        'cart-icon': '45px',
        'nav-utility': '53px',
        'product-card': '30px',
        'footer-col': '80px',
      },

      height: {
        'top-nav': '45px',
        'main-nav': '128px',
        'nav-pill': '91px',
        'footer': '642px',
        'hero': '623px',
      },

      boxShadow: {
        newsletter: '0px 10px 100px 0px rgba(0, 0, 0, 0.14)',
      },

      maxWidth: {
        content: '1330px',
        'nav-bar': '1200px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
