<script setup lang="ts">
import type { BlogPostProps } from '@nuxt/ui'

// Fetch YouTube videos from RSS feed
const { data: videos } = await useFetch('/api/youtube/feed')

// Transform YouTube videos to BlogPostProps format
const posts = computed<BlogPostProps[]>(() => {
  if (!videos.value) return []

  return videos.value.map((video, index) => ({
    title: video.title,
    image: video.thumbnail,
    date: new Date(video.publishedAt),
    to: video.url,
    target: '_blank',
    variant: 'outline',
    badge: index === 0
      ? {
          label: 'Novo',
          color: 'primary',
          variant: 'soft'
        }
      : undefined
  }))
})
</script>

<template>
  <UBlogPosts
    :posts="posts"
    class="col-span-2"
  />
</template>
