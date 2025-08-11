/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        // FastForm Brand Colors
        'excel-green': {
          DEFAULT: '#22A565',
          50: '#E8F5F0',
          100: '#C6E9D3',
          200: '#9DD9B7',
          300: '#74C99A',
          400: '#4BB77D',
          500: '#22A565',
          600: '#1E8A54',
          700: '#196F43',
          800: '#145432',
          900: '#0F3921',
        },
        'form-purple': {
          DEFAULT: '#6A3EBB',
          50: '#F0EBFC',
          100: '#D9CBF7',
          200: '#C2AAF2',
          300: '#AB89ED',
          400: '#9468E8',
          500: '#6A3EBB',
          600: '#5632A0',
          700: '#432785',
          800: '#2F1B6A',
          900: '#1C0F4F',
        },
        // removed midnight-navy palette to avoid dark backgrounds
        'flame': {
          DEFAULT: '#FFAC3B',
          50: '#FFF8ED',
          100: '#FFEECC',
          200: '#FFE4AA',
          300: '#FFDA88',
          400: '#FFD066',
          500: '#FFAC3B',
          600: '#E08B20',
          700: '#C16A05',
          800: '#8A4A00',
          900: '#532A00',
        },
        // Keep shadcn/ui colors with brand overrides (light theme)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#FFFFFF",
        foreground: "#222222",
        primary: {
          DEFAULT: "#22A565",
          foreground: "#FFFFFF",
          50: '#E8F5F0',
          100: '#C6E9D3',
          200: '#9DD9B7',
          300: '#74C99A',
          400: '#4BB77D',
          500: '#22A565',
          600: '#1E8A54',
          700: '#196F43',
          800: '#145432',
          900: '#0F3921',
        },
        secondary: {
          DEFAULT: "#6A3EBB",
          foreground: "#FFFFFF",
          50: '#F0EBFC',
          100: '#D9CBF7',
          200: '#C2AAF2',
          300: '#AB89ED',
          400: '#9468E8',
          500: '#6A3EBB',
          600: '#5632A0',
          700: '#432785',
          800: '#2F1B6A',
          900: '#1C0F4F',
        },
        accent: {
          DEFAULT: "#FFAC3B",
          foreground: "#1F2937",
          50: '#FFF8ED',
          100: '#FFEECC',
          200: '#FFE4AA',
          300: '#FFDA88',
          400: '#FFD066',
          500: '#FFAC3B',
          600: '#E08B20',
          700: '#C16A05',
          800: '#8A4A00',
          900: '#532A00',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F7FAFC",
          foreground: "#6B7280",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#222222",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#222222",
        },
        success: {
          500: '#22A565',
        },
        warning: {
          500: '#FFAC3B',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

