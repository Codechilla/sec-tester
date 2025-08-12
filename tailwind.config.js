/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          'dark': '#0a0a0a',
          'darker': '#050505',
          'primary': '#00ff41',
          'secondary': '#ff0080',
          'accent': '#00d4ff',
          'warning': '#ffaa00',
          'danger': '#ff0040',
          'success': '#00ff88',
          'info': '#0080ff',
          'muted': '#404040',
          'border': '#333333',
          'card': '#1a1a1a',
          'input': '#2a2a2a'
        }
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'cyber': ['Orbitron', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite linear',
        'scan': 'scan 2s linear infinite',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 20px #00ff41' },
          'to': { textShadow: '0 0 30px #00ff41, 0 0 40px #00ff41' }
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' }
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 65, 0.5)',
        'cyber-lg': '0 0 30px rgba(0, 255, 65, 0.7)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
