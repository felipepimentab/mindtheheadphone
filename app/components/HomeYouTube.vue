<script setup lang="ts">
import type { BlogPostProps } from '@nuxt/ui'

const posts: BlogPostProps[] = [
  {
    title: 'O Fone Que Eu Sempre Quis Criar:',
    image: 'https://i.ytimg.com/vi/fAgUFxRt76M/maxresdefault.jpg',
    date: '2025-10-13',
    to: 'https://youtu.be/fAgUFxRt76M?si=tbYjlLZNGmNMDQUx',
    target: '_blank',
    badge: {
      label: 'Novo',
      color: 'primary',
      variant: 'soft'
    }
  },
  {
    title: 'Nuxt 3.14',
    description: 'Nuxt 3.14 is out!',
    image: 'https://nuxt.com/assets/blog/v3.14.png',
    date: '2025-10-13',
    to: 'https://youtu.be/fAgUFxRt76M?si=tbYjlLZNGmNMDQUx',
    target: '_blank'
  },
  {
    title: 'Nuxt 3.13',
    description: 'Nuxt 3.13 is out!',
    image: 'https://nuxt.com/assets/blog/v3.13.png',
    date: '2024-08-22',
    to: 'https://youtu.be/KUugRv49Zjs?si=dNePOzYFwZFIYs8a',
    target: '_blank'
  },
  {
    title: 'Nuxt Icon v1',
    description: 'Discover Nuxt Icon v1!',
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: '2024-11-25',
    to: 'https://youtu.be/KUugRv49Zjs?si=dNePOzYFwZFIYs8a',
    target: '_blank'
  },
  {
    title: 'Nuxt 3.14',
    description: 'Nuxt 3.14 is out!',
    image: 'https://nuxt.com/assets/blog/v3.14.png',
    date: '2024-11-04',
    to: 'https://youtu.be/KUugRv49Zjs?si=dNePOzYFwZFIYs8a',
    target: '_blank'
  },
  {
    title: 'Nuxt 3.13',
    description: 'Nuxt 3.13 is out!',
    image: 'https://nuxt.com/assets/blog/v3.13.png',
    date: '2024-08-22',
    to: 'https://youtu.be/KUugRv49Zjs?si=dNePOzYFwZFIYs8a',
    target: '_blank'
  }
]
</script>

<template>
  <UBlogPosts
    :posts="posts"
    class="col-span-2"
  />
</template>
