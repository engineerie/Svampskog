<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const route = useRoute()

const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData(route.path, () => queryCollection('posts').all())

const selectedCategory = ref('all')

const normalizedPosts = computed(() => {
  return (posts.value ?? []).map((post) => {
    const category = post.category || post.badge?.label || 'Övrigt'
    return {
      ...post,
      category,
      badge: {
        ...(post.badge ?? {}),
        label: category
      }
    }
  })
})

const categories = computed(() => {
  const unique = new Set<string>()
  normalizedPosts.value.forEach((post) => {
    if (post.category) unique.add(post.category)
  })
  return Array.from(unique)
})

const categoryFilters = computed(() => ['all', ...categories.value])

watch(categories, (list) => {
  if (selectedCategory.value !== 'all' && !list.includes(selectedCategory.value)) {
    selectedCategory.value = 'all'
  }
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return normalizedPosts.value
  }
  return normalizedPosts.value.filter((post) => post.category === selectedCategory.value)
})

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <div class="">
    <UContainer>
      <UPageHeader :ui="{ root: 'border-b-0', container: 'lg:pt-12', title: 'sm:text-6xl', headline: 'text-neutral' }"
        v-bind="page" />

      <div v-if="categories.length" class="mb-12 mt-4 flex flex-wrap gap-2">
        <UButton v-for="category in categoryFilters" :key="category" :label="category === 'all' ? 'Alla' : category"
          color="neutral" :variant="selectedCategory === category ? 'soft' : 'ghost'"
          :aria-pressed="selectedCategory === category" class="rounded-lg" @click="selectedCategory = category" />
      </div>

      <UPageBody>
        <UBlogPosts v-if="filteredPosts.length">
          <UBlogPost v-for="(post, index) in filteredPosts" :key="post._path || index" :to="post.path"
            :title="post.title" :description="post.description" :image="post.image" :badge="post.badge" :class="[]"
            variant="naked" :ui="{
              description: 'line-clamp-2', header: 'rounded-md', root: 'rounded-md', body: 'px-0 sm:px-2'
            }" />
        </UBlogPosts>
        <div v-else class="py-12 text-center text-muted-500">
          Inga artiklar matchar kategorin just nu.
        </div>
      </UPageBody>
    </UContainer>
  </div>

</template>
