module.exports = {
  mode: 'jit',
  content: ['./src/**/*.js', '../public/*.html'],
  theme: {
    extend: {
      colors: {
        backdrop: '#121212',
        content: 'rgb(83, 83, 83)',
        primary: '#1db954',
        active: '#282828',
        link: '#b3b3b3',
        album: '#181818',
        btnhover: '#737373',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
