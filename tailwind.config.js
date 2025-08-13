/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Override default spacing scale (reduce by 20%)
    spacing: {
      px: '1px',
      0: '0px',
      '0.5': '0.1rem',    // 0.125rem * 0.8
      1: '0.2rem',      // 0.25rem * 0.8
      '1.5': '0.3rem',    // 0.375rem * 0.8
      2: '0.4rem',      // 0.5rem * 0.8
      '2.5': '0.5rem',    // 0.625rem * 0.8
      3: '0.6rem',      // 0.75rem * 0.8
      '3.5': '0.7rem',    // 0.875rem * 0.8
      4: '0.8rem',      // 1rem * 0.8
      5: '1rem',        // 1.25rem * 0.8
      6: '1.2rem',      // 1.5rem * 0.8
      7: '1.4rem',      // 1.75rem * 0.8
      8: '1.6rem',      // 2rem * 0.8
      9: '1.8rem',      // 2.25rem * 0.8
      10: '2rem',       // 2.5rem * 0.8
      11: '2.2rem',     // 2.75rem * 0.8
      12: '2.4rem',     // 3rem * 0.8
      14: '2.8rem',     // 3.5rem * 0.8
      16: '3.2rem',     // 4rem * 0.8
      20: '4rem',       // 5rem * 0.8
      24: '4.8rem',     // 6rem * 0.8
      28: '5.6rem',     // 7rem * 0.8
      32: '6.4rem',     // 8rem * 0.8
      36: '7.2rem',     // 9rem * 0.8
      40: '8rem',       // 10rem * 0.8
      44: '8.8rem',     // 11rem * 0.8
      48: '9.6rem',     // 12rem * 0.8
      52: '10.4rem',    // 13rem * 0.8
      56: '11.2rem',    // 14rem * 0.8
      60: '12rem',      // 15rem * 0.8
      64: '12.8rem',    // 16rem * 0.8
      72: '14.4rem',    // 18rem * 0.8
      80: '16rem',      // 20rem * 0.8
      96: '19.2rem',    // 24rem * 0.8
    },
    // Override default font sizes (reduce by 20%)
    fontSize: {
      xs: ['0.6rem', { lineHeight: '0.8rem' }],     // 0.75rem * 0.8
      sm: ['0.7rem', { lineHeight: '0.96rem' }],    // 0.875rem * 0.8
      base: ['0.8rem', { lineHeight: '1.2rem' }],   // 1rem * 0.8
      lg: ['0.9rem', { lineHeight: '1.4rem' }],     // 1.125rem * 0.8
      xl: ['1rem', { lineHeight: '1.6rem' }],       // 1.25rem * 0.8
      '2xl': ['1.2rem', { lineHeight: '1.6rem' }],  // 1.5rem * 0.8
      '3xl': ['1.5rem', { lineHeight: '1.92rem' }], // 1.875rem * 0.8
      '4xl': ['1.8rem', { lineHeight: '2.16rem' }], // 2.25rem * 0.8
      '5xl': ['2.4rem', { lineHeight: '2.4rem' }],  // 3rem * 0.8
      '6xl': ['3rem', { lineHeight: '3.2rem' }],    // 3.75rem * 0.8
      '7xl': ['3.6rem', { lineHeight: '3.6rem' }],  // 4.5rem * 0.8
      '8xl': ['4.8rem', { lineHeight: '4.8rem' }],  // 6rem * 0.8
      '9xl': ['6.4rem', { lineHeight: '6.4rem' }],  // 8rem * 0.8
    },
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
          'from': { textShadow: '0 0 16px #00ff41' },              // 20px * 0.8
          'to': { textShadow: '0 0 24px #00ff41, 0 0 32px #00ff41' } // 30px * 0.8, 40px * 0.8
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
        'cyber': '0 0 16px rgba(0, 255, 65, 0.5)',     // 20px * 0.8
        'cyber-lg': '0 0 24px rgba(0, 255, 65, 0.7)',  // 30px * 0.8
        'neon': '0 0 4px currentColor, 0 0 8px currentColor, 0 0 12px currentColor', // 5px, 10px, 15px * 0.8
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
