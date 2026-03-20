/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          lowest: 'hsl(var(--surface-container-lowest))',
          low: 'hsl(var(--surface-container-low))',
          medium: 'hsl(var(--surface-container))',
          high: 'hsl(var(--surface-container-high))',
          highest: 'hsl(var(--surface-container-highest))',
        },
        'on-surface': {
          DEFAULT: 'hsl(var(--on-surface))',
          variant: 'hsl(var(--on-surface-variant))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          container: 'hsl(var(--primary-container))',
          foreground: 'hsl(var(--on-primary))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          container: 'hsl(var(--secondary-container))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          container: 'hsl(var(--error-container))',
          foreground: 'hsl(var(--on-error))',
        },
        outline: 'hsl(var(--outline))',
        'outline-variant': 'hsl(var(--outline-variant))',
        'surface-tint': 'hsl(var(--surface-tint))',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'monospace'],
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        lg: '0.5rem',
        md: '0.375rem',
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-lg': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'headline-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'ambient': '0 0 32px 0 hsl(var(--surface-tint) / 0.06)',
        'elevated': '0 4px 16px 0 hsl(0 0% 0% / 0.3)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary-container)))',
      },
    },
  },
  plugins: [],
}
