import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'glare-blue': '#00BFFF',
        'glare-white': 'rgba(255, 255, 255, 0.8)',
        'glare-gray': 'rgba(102, 102, 102, 0.3)',
        'glare-dark': 'rgba(136, 136, 136, 0.15)',
      },
      fontFamily: {
        'inter-thin': ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'glare': '0.05em',
      },
      screens: {
        'xs': '375px',
        'sm': '428px',
        'md': '768px',
        'lg': '1024px',
      },
    },
  },
  plugins: [],
};

export default config;
