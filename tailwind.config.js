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
        // FastForm Brand Colors - Exact HSL values from brand system
        'velocity': {
          DEFAULT: 'hsl(38, 100%, 62%)',
          50: 'hsl(38, 100%, 95%)',
          100: 'hsl(38, 100%, 90%)',
          200: 'hsl(38, 100%, 85%)',
          300: 'hsl(38, 100%, 80%)',
          400: 'hsl(38, 100%, 75%)',
          500: 'hsl(38, 100%, 62%)',
          600: 'hsl(38, 100%, 55%)',
          700: 'hsl(38, 100%, 40%)',
          800: 'hsl(38, 100%, 35%)',
          900: 'hsl(38, 100%, 30%)',
        },
        'forms': {
          DEFAULT: 'hsl(251, 47%, 48%)',
          50: 'hsl(251, 47%, 95%)',
          100: 'hsl(251, 47%, 90%)',
          200: 'hsl(251, 47%, 85%)',
          300: 'hsl(251, 47%, 80%)',
          400: 'hsl(251, 47%, 75%)',
          500: 'hsl(251, 47%, 48%)',
          600: 'hsl(251, 47%, 40%)',
          700: 'hsl(251, 47%, 35%)',
          800: 'hsl(251, 47%, 30%)',
          900: 'hsl(251, 47%, 25%)',
        },
        'excel': {
          DEFAULT: 'hsl(142, 72%, 29%)',
          50: 'hsl(142, 72%, 95%)',
          100: 'hsl(142, 72%, 90%)',
          200: 'hsl(142, 72%, 85%)',
          300: 'hsl(142, 72%, 80%)',
          400: 'hsl(142, 72%, 75%)',
          500: 'hsl(142, 72%, 29%)',
          600: 'hsl(142, 72%, 25%)',
          700: 'hsl(142, 72%, 20%)',
          800: 'hsl(142, 72%, 15%)',
          900: 'hsl(142, 72%, 10%)',
        },
        // Keep shadcn/ui colors with brand overrides (light theme)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(220, 13%, 18%)",
        primary: {
          DEFAULT: "hsl(38, 100%, 62%)",
          foreground: "hsl(0, 0%, 100%)",
          50: 'hsl(38, 100%, 95%)',
          100: 'hsl(38, 100%, 90%)',
          200: 'hsl(38, 100%, 85%)',
          300: 'hsl(38, 100%, 80%)',
          400: 'hsl(38, 100%, 75%)',
          500: 'hsl(38, 100%, 62%)',
          600: 'hsl(38, 100%, 55%)',
          700: 'hsl(38, 100%, 40%)',
          800: 'hsl(38, 100%, 35%)',
          900: 'hsl(38, 100%, 30%)',
        },
        secondary: {
          DEFAULT: "hsl(251, 47%, 48%)",
          foreground: "hsl(0, 0%, 100%)",
          50: 'hsl(251, 47%, 95%)',
          100: 'hsl(251, 47%, 90%)',
          200: 'hsl(251, 47%, 85%)',
          300: 'hsl(251, 47%, 80%)',
          400: 'hsl(251, 47%, 75%)',
          500: 'hsl(251, 47%, 48%)',
          600: 'hsl(251, 47%, 40%)',
          700: 'hsl(251, 47%, 35%)',
          800: 'hsl(251, 47%, 30%)',
          900: 'hsl(251, 47%, 25%)',
        },
        accent: {
          DEFAULT: "hsl(142, 72%, 29%)",
          foreground: "hsl(0, 0%, 100%)",
          50: 'hsl(142, 72%, 95%)',
          100: 'hsl(142, 72%, 90%)',
          200: 'hsl(142, 72%, 85%)',
          300: 'hsl(142, 72%, 80%)',
          400: 'hsl(142, 72%, 75%)',
          500: 'hsl(142, 72%, 29%)',
          600: 'hsl(142, 72%, 25%)',
          700: 'hsl(142, 72%, 20%)',
          800: 'hsl(142, 72%, 15%)',
          900: 'hsl(142, 72%, 10%)',
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

