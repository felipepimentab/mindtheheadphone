export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      neutral: 'neutral'
    },
    button: {
      slots: {
        base: 'font-bold'
      }
    },
    pageHero: {
      slots: {
        title: 'lg:text-8xl',
        description: 'text-toned'
      }
    }
  }
});
