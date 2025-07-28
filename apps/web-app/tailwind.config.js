/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Enhanced UI v2.0 Color Palette
                glass: {
                    50: "rgba(255, 255, 255, 0.05)",
                    100: "rgba(255, 255, 255, 0.1)",
                    200: "rgba(255, 255, 255, 0.15)",
                    300: "rgba(255, 255, 255, 0.2)",
                    400: "rgba(255, 255, 255, 0.25)",
                    500: "rgba(255, 255, 255, 0.3)",
                },
                premium: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-out': 'fadeOut 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'slide-in-left': 'slideInLeft 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'glass-morph': 'glassMorph 0.6s ease-in-out',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                glassMorph: {
                    '0%': { 
                        backdropFilter: 'blur(4px)',
                        background: 'rgba(255, 255, 255, 0.1)',
                    },
                    '100%': { 
                        backdropFilter: 'blur(16px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                    },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
                },
            },
            backdropBlur: {
                'xs': '2px',
                '4xl': '72px',
                '5xl': '96px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'premium-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'inner-glass': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
                'glow-purple': '0 0 20px rgba(147, 51, 234, 0.5)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
            },
            transitionProperty: {
                'glass': 'backdrop-filter, background-color, border-color, transform, box-shadow',
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
            },
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [
        function({ addUtilities }) {
            addUtilities({
                '.glass-card': {
                    'background': 'rgba(255, 255, 255, 0.1)',
                    'backdrop-filter': 'blur(16px)',
                    'border': '1px solid rgba(255, 255, 255, 0.2)',
                    'border-radius': '16px',
                    'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                },
                '.glass-nav': {
                    'background': 'rgba(255, 255, 255, 0.8)',
                    'backdrop-filter': 'blur(20px)',
                    'border-bottom': '1px solid rgba(255, 255, 255, 0.3)',
                },
                '.glass-button': {
                    'background': 'rgba(255, 255, 255, 0.15)',
                    'backdrop-filter': 'blur(12px)',
                    'border': '1px solid rgba(255, 255, 255, 0.25)',
                    'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '.glass-button:hover': {
                    'background': 'rgba(255, 255, 255, 0.25)',
                    'backdrop-filter': 'blur(16px)',
                    'transform': 'translateY(-2px)',
                    'box-shadow': '0 12px 24px -6px rgba(0, 0, 0, 0.15)',
                },
                '.micro-bounce': {
                    'transition': 'transform 0.2s ease-in-out',
                },
                '.micro-bounce:hover': {
                    'transform': 'scale(1.05)',
                },
                '.hardware-accelerate': {
                    'transform': 'translateZ(0)',
                    'backface-visibility': 'hidden',
                    'perspective': '1000px',
                },
            })
        }
    ],
}
