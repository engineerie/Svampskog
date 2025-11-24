<template>
  <div class="space-y-4">
    <NuxtImg v-if="underlagbild" :src="underlagbild" class="rounded-lg" />

    <div v-if="sections.length" class="space-y-4">
      <div v-for="(section, idx) in sections" :key="idx" class="space-y-2">
        <h1 v-if="section.title" class="text-xl font-semibold text-neutral-900 my-5">{{ section.title }}</h1>
        <div class="space-y-2">
          <p v-for="(para, pIdx) in section.paragraphs" :key="pIdx" class="leading-relaxed my-3">
            {{ para }}
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="underlag" class="space-y-2">
      <p class="leading-relaxed text-neutral-800">{{ underlag }}</p>
    </div>

    <NuxtLink to="/info" class="text-primary underline">Läs mer i dokumentationen</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  underlag?: string | null;
  underlagbild?: string | null;
  sections?: Array<{ title?: string | null; paragraphs?: string[] | null; content?: string | null }> | null;
}>();

type Section = { title: string; paragraphs: string[] };

const sections = computed<Section[]>(() => {
  const rawSections = props.sections;
  if (Array.isArray(rawSections) && rawSections.length > 0) {
    return rawSections.map((section) => {
      const paragraphs =
        (Array.isArray(section?.paragraphs) && section.paragraphs.length > 0)
          ? section.paragraphs
          : section?.content
            ? section.content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
            : [];
      return {
        title: section?.title?.trim() ?? '',
        paragraphs,
      };
    }).filter(sec => sec.title || sec.paragraphs.length > 0);
  }
  return [];
});
</script>
