<script setup lang="ts">
import { computed } from 'vue'

type PostLike = Record<string, any>

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  indices?: number[]
  tags?: string[]
  limit?: number
}>(), {
  title: 'Relaterade kunskapsidor',
  description: 'Läs vidare i svampkunskap.',
  indices: () => [],
  tags: () => [],
  limit: 3
})

const dataKey = computed(() => {
  const idx = (props.indices || []).join(',')
  const tags = (props.tags || []).join(',')
  return `knowledge-selection:${idx}:${tags}:${props.limit}`
})

const { data: posts } = await useAsyncData(
  dataKey.value,
  () => queryCollection('posts').all()
)

const orderedPosts = computed<PostLike[]>(() =>
  [...(posts.value || [])].sort((a: PostLike, b: PostLike) => {
    const ap = String(a?._path || a?.path || '')
    const bp = String(b?._path || b?.path || '')
    return ap.localeCompare(bp, 'sv')
  })
)

function getPostTags(post: PostLike): string[] {
  const tags = post?.tags
  if (Array.isArray(tags)) return tags.map((t: unknown) => String(t).toLowerCase())
  if (typeof tags === 'string') return [tags.toLowerCase()]
  return []
}

const selectedPosts = computed<PostLike[]>(() => {
  const base = orderedPosts.value
  const picked: PostLike[] = []
  const seen = new Set<string>()
  const normalizedTags = (props.tags || []).map(tag => tag.toLowerCase())

  if (props.indices?.length) {
    for (const i of props.indices) {
      const post = base[i]
      if (!post) continue
      const key = String(post._path || post.path || i)
      if (seen.has(key)) continue
      seen.add(key)
      picked.push(post)
    }
  }

  if (normalizedTags.length) {
    for (const post of base) {
      const postTags = getPostTags(post)
      if (!postTags.some(tag => normalizedTags.includes(tag))) continue
      const key = String(post._path || post.path || '')
      if (seen.has(key)) continue
      seen.add(key)
      picked.push(post)
    }
  }

  if (!picked.length) {
    return base.slice(0, props.limit)
  }

  return picked.slice(0, props.limit)
})

const hasPosts = computed(() => selectedPosts.value.length > 0)
</script>

<template>
  <UPageSection v-if="hasPosts" :title="title" :description="description">

    <UBlogPosts>
      <UBlogPost v-for="(post, index) in selectedPosts" :key="post._path || post.path || index" :title="post.title"
        :description="post.description" :to="post.path || post._path" :image="post.image" variant="naked" :ui="{
          description: 'line-clamp-2',
          header: 'rounded-xl border border-1 border-muted/50 shadow-none',
          root: 'rounded-md',
          body: 'px-0 sm:px-2'
        }" />
    </UBlogPosts>
    <div class="mb-4 flex justify-start">
      <UButton to="/svampkunskap" label="Se alla kunskapsidor" icon="i-heroicons-arrow-right" trailing color="neutral"
        variant="outline" class="ring-muted/50" size="xl" />
    </div>
  </UPageSection>
</template>
