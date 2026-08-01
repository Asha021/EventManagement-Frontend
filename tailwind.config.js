import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        ink: "#14150F",
        paper: "#F1EFE3",
        cactus: {
          DEFAULT: "#3F5A38",
          50: "#EEF2EA",
          100: "#D6E0CD",
          200: "#AFC49F",
          300: "#87A872",
          400: "#5F8C4A",
          500: "#3F5A38",
          600: "#33482D",
          700: "#273622",
          800: "#1A2417",
          900: "#0D120B",
        },
        bloom: {
          DEFAULT: "#E6532C",
          50: "#FDECE7",
          100: "#FACFC1",
          400: "#EC6E48",
          500: "#E6532C",
          600: "#C43F1C",
        },
        sand: {
          DEFAULT: "#C9B98C",
          100: "#F2EDDD",
          200: "#E4D9B9",
          300: "#D6C69B",
        },
        line: "#D8D3C0",
        muted: "#8A8674",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
