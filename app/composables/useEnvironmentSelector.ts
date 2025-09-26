import { computed, onMounted, ref } from 'vue'
import {
  useEnvParamsStore,
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions
} from '~/stores/envParamsStore'

type CategoryKey = 'geography' | 'forestType' | 'standAge' | 'vegetationType'

type UseEnvironmentSelectorOptions = {
  restrictionEnabled?: boolean
}

type Combination = {
  geo: string
  forest: string
  age: string
  veg: string
}

const categories = [
  {
    key: 'geography' as const,
    title: 'Var i Sverige',
    defaultLabel: 'Välj plats',
    icon: 'material-symbols:location-on-outline',
    options: geographyOptions
  },
  {
    key: 'forestType' as const,
    title: 'Skogstyp',
    defaultLabel: 'Välj skogstyp',
    icon: 'lucide:trees',
    options: forestTypeOptions
  },
  {
    key: 'standAge' as const,
    title: 'Skogsålder',
    defaultLabel: 'Välj ålder',
    icon: 'carbon:crop-growth',
    options: standAgeOptions
  },
  {
    key: 'vegetationType' as const,
    title: 'Fältskikt',
    defaultLabel: 'Välj fältskikt',
    icon: 'fluent-emoji-high-contrast:herb',
    options: vegetationTypeOptions
  }
]

export function useEnvironmentSelector(options: UseEnvironmentSelectorOptions = {}) {
  const envStore = useEnvParamsStore()
  const restrictionEnabled = ref(options.restrictionEnabled ?? true)

  const validCombinations = useState<Combination[]>(
    'environment-selector:valid-combinations',
    () => [],
  )

  onMounted(async () => {
    if (!restrictionEnabled.value) {
      return
    }
    if (validCombinations.value.length) {
      return
    }
    const { data } = await useFetch<Combination[]>('/validCombinations.json')
    if (data.value) {
      validCombinations.value = data.value
    }
  })

  const enabledOptions = computed(() => ({
    geography: geographyOptions.map((option) => ({
      ...option,
      disabled: isDisabled('geography', option.value)
    })),
    forestType: forestTypeOptions.map((option) => ({
      ...option,
      disabled: isDisabled('forestType', option.value)
    })),
    standAge: standAgeOptions.map((option) => ({
      ...option,
      disabled: isDisabled('standAge', option.value)
    })),
    vegetationType: vegetationTypeOptions.map((option) => ({
      ...option,
      disabled: isDisabled('vegetationType', option.value)
    }))
  }))

  function isDisabled(category: CategoryKey, value: string) {
    if (!restrictionEnabled.value) {
      return false
    }
    if (!validCombinations.value.length) {
      return false
    }

    const matches = validCombinations.value.some((combination) => {
      const matchesGeo = !envStore.geography || combination.geo === envStore.geography
      const matchesForest = !envStore.forestType || combination.forest === envStore.forestType
      const matchesAge = !envStore.standAge || combination.age === envStore.standAge
      const matchesVeg = !envStore.vegetationType || combination.veg === envStore.vegetationType

      const categoryMatch =
        (category === 'geography' && combination.geo === value) ||
        (category === 'forestType' && combination.forest === value) ||
        (category === 'standAge' && combination.age === value) ||
        (category === 'vegetationType' && combination.veg === value)

      return matchesGeo && matchesForest && matchesAge && matchesVeg && categoryMatch
    })

    return !matches
  }

  function toggleRestriction() {
    restrictionEnabled.value = !restrictionEnabled.value
  }

  function selectOption(category: CategoryKey, optionValue: string) {
    envStore.$patch({ [category]: optionValue })
  }

  function getLabel(category: CategoryKey) {
    switch (category) {
      case 'geography':
        return envStore.geographyLabel
      case 'forestType':
        return envStore.forestTypeLabel
      case 'standAge':
        return envStore.standAgeLabel
      case 'vegetationType':
        return envStore.vegetationTypeLabel
      default:
        return ''
    }
  }

  const allSelected = computed(() =>
    Boolean(
      envStore.geography &&
      envStore.forestType &&
      envStore.standAge &&
      envStore.vegetationType,
    ),
  )

  return {
    envStore,
    categories,
    enabledOptions,
    restrictionEnabled,
    toggleRestriction,
    selectOption,
    getLabel,
    allSelected,
  }
}
