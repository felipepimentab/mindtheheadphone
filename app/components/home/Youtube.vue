<script setup lang="ts">
import type { BlogPostProps } from '@nuxt/ui';

// Fetch YouTube videos from RSS feed
const { data: videos } = await useFetch('/api/youtube/feed');

// Transform YouTube videos to BlogPostProps format
const posts = computed<BlogPostProps[]>(() => {
  if (!videos.value) return [];

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
  }));
});

const fallbackPosts: BlogPostProps[] = [
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  },
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  },
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  },
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  },
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  },
  {
    title: '',
    image: '',
    date: '',
    variant: 'soft'
  }
];
</script>

<template>
  <ClientOnly>
    <UBlogPosts
      :posts="posts"
      class="col-span-2"
    />
    <template #fallback>
      <UBlogPosts
        :posts="fallbackPosts"
        class="col-span-2"
      />
    </template>
  </ClientOnly>
</template>
