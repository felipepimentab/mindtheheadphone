export default defineAppConfig({
  ui: {
    colors: {
      primary: 'mth',
      neutral: 'neutral'
    },
    button: {
      slots: {
        base: 'font-bold cursor-pointer'
      },
      variants: {
        variant: {
          subtle: 'backdrop-blur-xs',
          soft: 'backdrop-blur-xs'
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'soft',
          class: 'bg-primary/15 hover:bg-primary/20 backdrop-brightness-90 text-shadow-lg'
        }
      ]
    },
    blogPost: {
      slots: {
        title: 'line-clamp-3'
      }
    }
  }
});
