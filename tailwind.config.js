/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "primary": "#0df265",
                "background-light": "#f5f8f7",
                // "background-dark": "#050505",
                // "accent-dark": "#0a1a0f",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}

module.exports = config