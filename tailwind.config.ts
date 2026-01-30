import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      colors: {
        // Paleta
        plant: {
          primary: "#2ECC71", // Verde Vivo — principal
          dark: "#14532D", // Verde Escuro — contraste forte
          highlight: "#F1C40F", // Amarelo Solar — destaque/alertas leves
          ice: "#F4F4F4", // Cinza Gelo — fundo
          graphite: "#1E1E1E", // Preto Grafite — textos/contraste
        },

        // Atalhos “semânticos” comuns
        brand: {
          DEFAULT: "#2ECC71",
          foreground: "#1E1E1E",
          dark: "#14532D",
          accent: "#F1C40F",
          surface: "#F4F4F4",
        },
      },

      // sombras suaves “plant”
      boxShadow: {
        plant: "0 8px 24px rgba(20, 83, 45, 0.15)",
      },

      //  gradientes prontos
      backgroundImage: {
        "plant-radial":
          "radial-gradient(80% 80% at 50% 0%, #2ECC71 0%, #14532D 60%)",
        "plant-linear":
          "linear-gradient(135deg, #14532D 0%, #2ECC71 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
