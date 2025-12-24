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
