/**
 * Tailwind configuration tuned for Complyt AI (enterprise fintech look)
 * - Maps many design tokens to CSS variables (defined in app/globals.css)
 * - Adds dashboard shadows, glow effects, animations, and chart colors
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        // Map to CSS variables so runtime theme switching works via :root / .dark
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        destructive: 'var(--destructive)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        border: 'var(--border)',
        popover: 'var(--popover)',

        // Sidebar tokens
        sidebar: 'var(--sidebar)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-primary': 'var(--sidebar-primary)',
        'sidebar-accent': 'var(--sidebar-accent)',

        // Chart tokens
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      boxShadow: {
        'dash-sm': '0 6px 18px rgba(3,10,18,0.06)',
        'dash-md': '0 12px 40px rgba(3,10,18,0.08)',
        'glow-sm': '0 6px 24px rgba(37, 99, 235, 0.08)',
        'glow-md': '0 12px 48px rgba(56, 189, 248, 0.08)',
      },
      dropShadow: {
        'dash-soft': '0 6px 18px rgba(2,6,23,0.06)',
      },
      borderRadius: {
        'lg-2': '0.75rem',
        'xl-2': '1rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'subtle-pulse': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 0px rgba(56,189,248,0.0)' },
          '50%': { boxShadow: '0 0 30px rgba(56,189,248,0.08)' },
          '100%': { boxShadow: '0 0 0px rgba(56,189,248,0.0)' },
        }
      },
      animation: {
        'fade-up': 'fade-up 360ms cubic-bezier(.2,.9,.2,1) both',
        'subtle-pulse': 'subtle-pulse 2200ms ease-in-out infinite',
        'glow': 'glow 2200ms ease-in-out infinite',
      },
      backgroundImage: {
        // utility gradients used by dashboard components
        'hero-pattern': 'linear-gradient(180deg, rgba(15,23,42,0.04) 0%, transparent 40%)',
      },
      ringColor: {
        primary: 'var(--ring)',
      },
      borderColor: {
        soft: 'var(--border)',
      },
      spacing: {
        'container': '1200px'
      }
    },
  },
  plugins: [],
};
