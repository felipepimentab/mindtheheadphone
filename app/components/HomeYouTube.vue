<script setup lang="ts">
import type { BlogPostProps } from '@nuxt/ui'

interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  url: string
}

// Fetch YouTube videos from RSS feed
const { data: videos } = await useFetch<YouTubeVideo[]>('/api/youtube/feed')

// Transform YouTube videos to BlogPostProps format
const posts = computed<BlogPostProps[]>(() => {
  if (!videos.value) return []

  return videos.value.map((video, index) => ({
    title: video.title,
    image: video.thumbnail,
    date: new Date(video.publishedAt),
    to: video.url,
    target: '_blank',
    variant: 'soft',
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
