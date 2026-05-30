/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A9B8F',
          dark: '#2D7A6F',
          light: '#E8F5F3',
        },
        accent: {
          DEFAULT: '#F5A623',
          light: '#FEF3DC',
        },
        calm: {
          DEFAULT: '#9B8EC4',
          light: '#EEF0FF',
        },
        danger: {
          DEFAULT: '#E05A5A',
          light: '#FDF0F0',
        },
        surface: {
          DEFAULT: '#FAFBFC',
          card: '#FFFFFF',
          muted: '#F4F6F8',
        },
        text: {
          primary: '#1A2B35',
          secondary: '#5A6B78',
          muted: '#8FA0AD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(74, 155, 143, 0.08)',
        card: '0 4px 24px rgba(26, 43, 53, 0.08)',
        'card-hover': '0 8px 32px rgba(26, 43, 53, 0.14)',
        glow: '0 0 20px rgba(74, 155, 143, 0.25)',
      },
      backgroundImage: {
        'gradient-teal': 'linear-gradient(135deg, #4A9B8F 0%, #2D7A6F 100%)',
        'gradient-calm': 'linear-gradient(135deg, #9B8EC4 0%, #7B6EA8 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F5A623 0%, #E8941A 100%)',
        'gradient-soft': 'linear-gradient(180deg, #E8F5F3 0%, #EEF0FF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #E8F5F3 0%, #EEF0FF 50%, #FEF3DC 100%)',
      },
      animation: {
        'breathe-in': 'scale 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
