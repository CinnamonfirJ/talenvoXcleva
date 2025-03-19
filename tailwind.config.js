/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      color: {
        primary: "#03174B",
        secondary: "#FFDAD6",
        accent: "#E1C46D",
        // accent: "#DCE1FF"
      },
    },
  },
  plugins: [],
};
