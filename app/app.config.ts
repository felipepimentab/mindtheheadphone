export default defineAppConfig({
  ui: {
    colors: {
      primary: 'mth',
      neutral: 'neutral'
    },
    button: {
      slots: {
        base: 'font-bold cursor pointer'
      },
      variants: {
        variant: {
          subtle: 'backdrop-blur',
          soft: 'backdrop-blur'
        }
      }
    },
    blogPost: {
      slots: {
        title: 'line-clamp-3'
      }
    }
  }
});
