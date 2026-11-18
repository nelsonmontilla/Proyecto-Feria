/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#154F6B",      // Deep Ocean Teal-Blue ("ANIMAL ADVISOR" text & outer ring)
          teal: "#1D6A8B",      // Mid Teal-Blue from emblem ring
          cyan: "#44A8C6",      // Bright Cyan-Turquoise from emblem ring
          mint: "#7AD6B7",      // Soft Aqua-Mint from top-right ring gradient
          amber: "#F29D38",     // Warm Golden Dog & Star accent
          amberDark: "#D97F1C", // Hover state for Warm Golden CTA
          slate: "#687582",     // Cool Cat Gray & "GUIDE TO PET ADOPTION" subtitle
          ice: "#F2FAFC",       // Soft Ice Blue-Mint surface tint
          cream: "#FFF8EE"      // Soft Warm Amber surface tint
        }
      },
      fontFamily: {
        heading: ["'Varela Round'", "'Nunito Sans'", "sans-serif"],
        sans: ["'Nunito Sans'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -5px rgba(21, 79, 107, 0.08), 0 4px 12px -2px rgba(21, 79, 107, 0.04)",
        card: "0 14px 28px -8px rgba(21, 79, 107, 0.12), 0 4px 10px -3px rgba(68, 168, 198, 0.08)"
      }
    }
  },
  plugins: []
};
