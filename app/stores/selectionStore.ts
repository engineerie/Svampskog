// stores/selectionStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface SelectedOptions {
  geography: string | null
  forestType: string | null
  standAge: string | null
  vegetationType: string | null
}

export const useSelectionStore = defineStore('selection', () => {
  const router = useRouter()
  const route = useRoute()

  // State: holds the current environment selections.
  const selectedOptions: Ref<SelectedOptions> = ref({
    geography: (route.params.geography as string) || null,
    forestType: (route.params.forestType as string) || null,
    standAge: (route.params.standAge as string) || null,
    vegetationType: (route.params.vegetationType as string) || null,
  })

  // Update a selection for a given category.
  function updateSelection(value: string, category: keyof SelectedOptions) {
    // Toggle: if the same value is clicked, reset it.
    selectedOptions.value[category] =
      selectedOptions.value[category] === value ? null : value
  }

  // Reset all selections.
  function resetSelections() {
    selectedOptions.value = {
      geography: null,
      forestType: null,
      standAge: null,
      vegetationType: null,
    }
  }

  // A computed property that builds the new route path based on current selections.
  const generatedPath = computed<string>(() => {
    const { geography, forestType, standAge, vegetationType } = selectedOptions.value
    if (!geography || !forestType || !standAge || !vegetationType) return ''
    return `/mykorrhizasvampar/${encodeURIComponent(geography)}/${encodeURIComponent(forestType)}/${encodeURIComponent(standAge)}/${encodeURIComponent(vegetationType)}`
  })

  // Whenever the selected options change, if they’re complete and the URL isn’t already set,
  // push the new route.
  watch(
    selectedOptions,
    () => {
      if (generatedPath.value && generatedPath.value !== route.fullPath) {
        router.push(generatedPath.value)
      }
    },
    { deep: true }
  )

  return {
    selectedOptions,
    updateSelection,
    resetSelections,
    generatedPath,
  }
})