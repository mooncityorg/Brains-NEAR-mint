module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1140px",
          xl: "1140px",
          "2xl": "1500px",
        },
      },
      colors: {
        primary: {
          DEFAULT: "#EFE9E8",
        },
        secondary: {
          DEFAULT: "#C1333D",
        },
      },
      fontFamily: {
        serif: ["Helvetica"],
      },
    },
  },
  plugins: [],
};
