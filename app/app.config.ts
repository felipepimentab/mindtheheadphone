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
    page: {
      slots: {
        left: 'lg:col-span-3',
        center: 'lg:col-span-7'
      }
    }
  }
})
