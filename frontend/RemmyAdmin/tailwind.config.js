/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // "./stories/**/*.{js,ts,jsx,tsx,vue}", // uncomment for Storybook
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0faf0',
          100: '#dcf5dc',
          200: '#b8ebb8',
          300: '#7ed97e',
          400: '#4ab84a',
          500: '#228B22',   // Forest Green — PRIMARY
          600: '#1a6e1a',
          700: '#145714',
          800: '#0e400e',
          900: '#082b08',
          DEFAULT: '#228B22',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt:     '#f9fafb',
          muted:   '#f1f5f9',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted:   '#64748b',
          faint:   '#94a3b8',
        },
        line: {
          DEFAULT: '#e5e7eb',
          muted:   '#f1f5f9',
        },
        danger:  '#ef4444',
        warning: '#f59e0b',
        success: '#228B22',
        info:    '#3b82f6',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08)',
        panel: '0 4px 12px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        card: '0.5rem',
        btn:  '0.375rem',
      },
    },
  },
  plugins: [],
}
