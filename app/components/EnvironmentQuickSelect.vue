<template>
  <UModal :title="title" :ui="{ body: 'p-0', title: 'text-2xl' }">
    <UButton :label="triggerLabel" :icon="triggerIcon" :color="triggerColor" :size="triggerSize"
      :variant="triggerVariant" :trailing="triggerTrailing" />
    <template #body>
      <div class="w-full max-w-full p-4 space-y-4">
        <USelect v-for="category in categories" :key="category.key" :items="enabledOptions[category.key]"
          v-model="envStore[category.key]" :placeholder="category.defaultLabel" size="xl" class="w-full"
          variant="outline" append-to-body>
          <template #item="{ item }">
            <div class="flex flex-col">
              <span class="text-lg font-medium">{{ item.label }}</span>
              <span v-if="item.description" class="text-sm text-neutral-500">{{ item.description }}</span>
            </div>
          </template>
        </USelect>
        <div class="grid grid-cols-2 gap-2">
          <UButton :label="restrictionLabel" size="xl" :icon="restrictionIcon" trailing
            :color="restrictionEnabled ? restrictionActiveColor : triggerColor"
            @click="toggleRestriction" variant="subtle" />
          <UModal fullscreen title="Kombinationer" :ui="{ title: 'text-2xl' }">
            <UButton :label="combinationsLabel" size="xl" shape="full" trailing icon="mdi:apps" color="neutral"
              variant="outline" />
            <template #body>
              <UButton size="xl" trailing :icon="restrictionIcon" @click="toggleRestriction" shape="full"
                class="transition-all shrink-0 mb-2 w-full" variant="soft"
                :color="restrictionEnabled ? restrictionActiveColor : triggerColor">
                {{ restrictionEnabled ? restrictionActiveText : restrictionInactiveText }}
              </UButton>
              <div class="grid gap-2">
                <UCard v-for="category in categories" :key="category.key" variant="soft">
                  <div v-for="option in enabledOptions[category.key]" :key="option.value"
                    class="flex justify-between mb-2 text-neutral-500 items-center">
                    <label :for="`${category.key}-${option.value}`"
                      :class="{ 'opacity-40 cursor-not-allowed': option.disabled, 'cursor-pointer': !option.disabled }"
                      class="text-lg">
                      {{ option.label }}
                    </label>
                    <UCheckbox :id="`${category.key}-${option.value}`" color="primary"
                      :model-value="envStore[category.key] === option.value"
                      @update:model-value="() => { if (!option.disabled) selectOption(category.key, option.value) }"
                      :disabled="option.disabled" />
                  </div>
                </UCard>
              </div>
            </template>
          </UModal>
          <UModal fullscreen title="Miljööversikt" class="col-span-2"
            :ui="{ content: 'overflow-y-scroll px-0', body: 'p-0', title: 'text-2xl' }">
            <UButton size="xl" label="Alla miljöer" trailing icon="i-hugeicons-tree-06" color="neutral"
              variant="subtle" />
            <template #body>
              <Miljoer />
            </template>
          </UModal>
        </div>
        <Transition name="fade" mode="out-in">
          <SpatialForest class="rounded overflow-hidden border border-neutral-200 h-fit" />
        </Transition>
        <slot name="actions" :all-selected="allSelected" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Miljoer from '~/components/Miljoer.vue'
import SpatialForest from '~/components/SpatialForest.vue'
import { useEnvironmentSelector } from '~/composables/useEnvironmentSelector'

const props = withDefaults(defineProps<{
  title?: string
  triggerLabel: string
  triggerIcon?: string
  triggerColor?: string
  triggerVariant?: string
  triggerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  triggerTrailing?: boolean
}>(), {
  title: 'Välj miljö',
  triggerIcon: 'i-heroicons-magnifying-glass',
  triggerColor: 'neutral',
  triggerVariant: 'solid',
  triggerSize: 'xl',
  triggerTrailing: false,
})

const combinationsLabel = 'Kombinationer'
const restrictionLabel = 'DNA-data'
const restrictionActiveText = 'Begränsar till där det finns DNA-data'
const restrictionInactiveText = 'Inkluderar alla miljöer'
const restrictionActiveColor = 'secondary'

const restrictionIcon = computed(() => (restrictionEnabled.value ? 'mdi:lock' : 'mdi:lock-open'))

const {
  envStore,
  categories,
  enabledOptions,
  restrictionEnabled,
  toggleRestriction,
  selectOption,
  allSelected,
} = useEnvironmentSelector({ restrictionEnabled: true })
</script>
