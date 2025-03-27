<template>
  <div class="">
    <div
      class=""
    >
      <div class="flex gap-2 p-2 justify-between z-30" >
       <!-- Remove these USelect components from the top filter bar -->
<!--
<USelect
  v-model="selectedFilter"
  multiple
  :items="svampOptions"
  placeholder="Filtrera svamptyp"
/>
<USelect
  v-model="selectedGrupp"
  multiple
  :items="gruppOptions"
  placeholder="Filtrera grupp"
/>
<USelect
  v-model="selectedStatus"
  multiple
  :items="statusOptions"
  placeholder="Filtrera status"
/>
-->

<!-- And add the following block in their place -->
<div class="flex gap-2 items-end">  
  <UInput
          :model-value="table?.tableApi?.getState().globalFilter || ''"
          class="max-w-sm min-w-[12ch]"
          placeholder="Sök på namn"
          @update:model-value="value => table?.tableApi?.setGlobalFilter(value)"
          variant="ghost"
        />
  
</div>
<div class="flex gap-2">
  <template v-if="selectedMark.length">
    <span v-for="filter in selectedMark" :key="'mark-'+filter">
      <UBadge
        trailing-icon="i-heroicons-x-mark-solid"
        variant="subtle"
        :color="filter === 'KALKmark' ? 'kalkmark' : filter === 'ANNANmark' ? 'vanligmark' : 'neutral'"
        class="cursor-pointer"
        @click="selectedMark = selectedMark.filter(f => f !== filter)"
      >
        {{ filter === 'KALKmark' ? 'Kalkmark' : filter === 'ANNANmark' ? 'Vanlig skogsmark' : capitalize(filter) }}
      </UBadge>
    </span>
  </template>
  <template v-if="selectedFilter.length">
    <span v-for="filter in selectedFilter" :key="'svamp-'+filter">
      <UBadge
        trailing-icon="i-heroicons-x-mark-solid"
        variant="subtle"
        :color="filter === 'Matsvamp' ? 'warning' : filter === 'Giftsvamp' ? 'poison' : 'neutral'"
        class="cursor-pointer"
        @click="selectedFilter = selectedFilter.filter(f => f !== filter)"
      >
        {{ capitalize(filter) }}
      </UBadge>
    </span>
  </template>
  <template v-if="selectedGrupp.length">
    <span v-for="filter in selectedGrupp" :key="'grupp-'+filter">
      <UBadge
        trailing-icon="i-heroicons-x-mark-solid"
        variant="subtle"
        color="neutral"
        class="cursor-pointer"
        @click="selectedGrupp = selectedGrupp.filter(f => f !== filter)"
      >
        {{ capitalize(filter) }}
      </UBadge>
    </span>
  </template>
  <template v-if="selectedStatus.length">
    <span v-for="filter in selectedStatus" :key="'status-'+filter">
      <UBadge
        trailing-icon="i-heroicons-x-mark-solid"
        variant="subtle"
        :color="filter === 'Signalart' ? 'signal' : getStatusColor(filter)"
        class="cursor-pointer"
        @click="selectedStatus = selectedStatus.filter(f => f !== filter)"
      >
        {{ filter === 'Signalart' ? 'Signalart' : getStatusTooltip(filter) }}
      </UBadge>
    </span>
  </template>

  <UDropdownMenu
  :items="table?.tableApi?.getAllColumns()?.filter(column => column.getCanHide())?.map(column => ({
    label: column.columnDef.meta?.headerText || upperFirst(column.id),
    type: 'checkbox',
    checked: column.getIsVisible(),
    onUpdateChecked(checked) {
      table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
    },
    onSelect(e) {
      e?.preventDefault()
    }
  }))"
  :content="{ align: 'end' }"
>
  <UButton
    label="Kolumner"
    color="neutral"
    variant="ghost"
    trailing-icon="i-lucide-chevron-down"
  />
</UDropdownMenu>

        <div v-if="!isNormalView" >
          <USelect
            v-model="rowsPerPage"
            :items="[
              { value: 10, label: '10 rader' },
              { value: 20, label: '20 rader' },
              { value: 30, label: '30 rader' },
              { value: 40, label: '40 rader' },
              { value: 50, label: '50 rader' },
              { value: 'Alla', label: 'Alla' }
            ]"
            item-value="value"
            item-label="label"
            placeholder="Rader per sida"
            variant="ghost"
          />
        </div>
      </div>
       
      </div>
      <div v-if="filteredData" :class="[isNormalView ? '' : '']">
        <div class="">
          <!-- v-model="selectedRows" -->

          <!-- UTable with Filtered Data -->
        
          <UTable
            ref="table"
            v-model:column-visibility="columnVisibility"
            v-model:pagination="pagination"
            :data="filteredData"
            :columns="columns"
            sticky
            :loading="isLoading"
            v-model:sorting="sorting"
            @select="selectRow"
            :autoResetAll="true" 
            :pagination-options="!isNormalView ? { getPaginationRowModel: getPaginationRowModel() } : undefined"
            :class="{ 'h-[442px]': isNormalView }"
          />
          <div
            class="flex justify-between items-center p-5 border-t-[1px] border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex h-fit shrink-0 gap-1 items-center">
              <!-- Left mini-legend -->
              
              <h1
            
              >
                Visar {{ startItem }} till {{ endItem }} av
                {{ totalItems }} arter
              </h1>
          
            </div>

            <div>
              <!-- Pagination component -->
              <div v-if="!isNormalView && rowsPerPage !== 'Alla'">
                <div class="flex justify-center">
                  <UPagination
                  active-variant="ghost"
                  variant="ghost"
                    :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="max-w-sm space-y-2 mt-2">
          <USkeleton class="h-4 w-full rounded" />
          <USkeleton class="h-4 w-[85%] rounded" />
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h, resolveComponent } from "vue";
import { useSpeciesStore } from "~/stores/speciesStore";
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { upperFirst } from 'scule'


const props = defineProps({
  isNormalView: { type: Boolean, default: false },
  dataTypeFolder: { type: String, default: 'edna' },
  dataType: { type: String, default: 'data' },
  grupp: { type: String, default: 'Svamp-grupp-släkte' },
  mat: { type: String, default: 'matsvamp' },
  obs: { type: String, default: 'sample_plot_count' },
  obsLabel: { type: String, default: 'Förekomst' },
  columnVisibilityOverrides: { type: Object, default: () => ({}) },
  filterEdible: { type: Boolean, default: false },
  filterPoison: { type: Boolean, default: false }
});



const table = useTemplateRef('table')

const defaultVisibility = {
  RankRed: false,
  "Rank matsvamp": false,
  "Rank giftsvamp": false,
};

const columnVisibility = ref({ ...defaultVisibility, ...props.columnVisibilityOverrides });

// Define a reactive array for selected mark filters
const selectedMark = ref([]);
// Create computed mark options – these will include the count of matches.
const markOptions = computed(() => {
  const counts = {};
  // Iterate over filteredData to count how many rows have each mark
  filteredData.value.forEach(row => {
    if (row.KALKmark) {
      counts["Kalkmark"] = (counts["Kalkmark"] || 0) + 1;
    }
    if (row.ANNANmark) {
      counts["Vanlig skogsmark"] = (counts["Vanlig skogsmark"] || 0) + 1;
    }
  });
  return [
    { label: `Kalkmark (${counts["Kalkmark"] || 0})`, value: "KALKmark" },
    { label: `Vanlig skogsmark (${counts["Vanlig skogsmark"] || 0})`, value: "ANNANmark" }
  ];
});

// Create the markMenuItems computed property similar to statusMenuItems:
const markMenuItems = computed(() => {
  return markOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedMark.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedMark.value.includes(option.value)) {
          selectedMark.value.push(option.value);
        }
      } else {
        selectedMark.value = selectedMark.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const svampOptions = computed(() => {
  const options = ['Matsvamp', 'Giftsvamp'];
  const counts = {};
  filteredData.value.forEach(row => {
    let matVal = row[props.mat];
    if (props.mat === "Nyasvamp-boken") {
      if (matVal && String(matVal).toLowerCase() === 'x') {
        counts['Matsvamp'] = (counts['Matsvamp'] || 0) + 1;
      }
    } else {
      if (matVal == 1) {
        counts['Matsvamp'] = (counts['Matsvamp'] || 0) + 1;
      }
    }
    if ((row.Giftsvamp || '').toLowerCase() === 'x') {
      counts['Giftsvamp'] = (counts['Giftsvamp'] || 0) + 1;
    }
  });
  return options.map(opt => ({
    label: `${opt} (${counts[opt] || 0})`,
    value: opt
  }));
});

const rowsPerPage = ref(props.isNormalView ? 500 : 10);
const selectedFilter = ref([]);
const selectedStatus = ref([]);
const selectedGrupp = ref([]);
const gruppMenuItems = computed(() => {
  return gruppOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedGrupp.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedGrupp.value.includes(option.value)) {
          selectedGrupp.value.push(option.value);
        }
      } else {
        selectedGrupp.value = selectedGrupp.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const svampMenuItems = computed(() => {
  return svampOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedFilter.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedFilter.value.includes(option.value)) {
          selectedFilter.value.push(option.value);
        }
      } else {
        selectedFilter.value = selectedFilter.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const statusMenuItems = computed(() => {
  return statusOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedStatus.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedStatus.value.includes(option.value)) {
          selectedStatus.value.push(option.value);
        }
      } else {
        selectedStatus.value = selectedStatus.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const gruppOptions = computed(() => {
  const counts = {};
  // Iterate over filteredData (or data.value if you want counts from all data)
  filteredData.value.forEach(row => {
    const group = row[props.grupp];
    if (group) {
      counts[group] = (counts[group] || 0) + 1;
    }
  });
  // Create an options array with labels including counts
  return Object.keys(counts).map(group => ({
    label: `${capitalize(group)} (${counts[group]})`,
    value: group
  }));
});

const statusOptions = computed(() => {
  // Define the base statuses
  const statuses = ['LC', 'NT', 'EN', 'VU', 'CR', 'RE', 'DD'];

  // Initialize a counts object for each status and for 'Ej bedömd'
  const counts = {};
  // Iterate over the full data
  data.value.forEach(row => {
    const statusVal = row.RL2020kat;
    if (statuses.includes(statusVal)) {
      counts[statusVal] = (counts[statusVal] || 0) + 1;
    } else if (
      statusVal === '0' ||
      String(statusVal).toUpperCase() === 'NA' ||
      String(statusVal).toUpperCase() === 'NE'
    ) {
      counts['Ej bedömd'] = (counts['Ej bedömd'] || 0) + 1;
    }
  });

  // Compute the number of rows that have SIGNAL_art === 'S'
  const signalCount = data.value.reduce((acc, row) => {
  return acc + ((row.SIGNAL_art === 'S') ? 1 : 0);
}, 0);

  // Build the options array with counts appended to the label
  return [
    ...statuses.map(s => ({
      label: `${getStatusTooltip(s)} (${counts[s] || 0})`,
      value: s
    })),
    { label: `Ej bedömd (${counts['Ej bedömd'] || 0})`, value: 'Ej bedömd' },
    { label: `Signalart (${signalCount})`, value: 'Signalart' }
  ];
});

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
});

const speciesStore = useSpeciesStore();

function selectRow(row, e) {
  speciesStore.selectSpecies(row.original, "edna");
}

// Capitalize function for displaying the species name
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const sampleEnvCount = computed(() => {
  return data.value.length > 0 ? data.value[0].sample_env_count : 0;
});

const getIconPath = (svampGrupp) => {
  const iconMapping = {
    övrigt: "BasilOther1Solid.png",
    hattsvamp: "hattsvamp.png",
    kantarell: "kantarell.webp",
    sopp: "sopp.png",
    taggsvamp: "taggsvamp.png",
    fingersvamp: "fingersvamp.webp",
    tryffel: "tryffel.webp",
    skinnsvamp: "skinnsvamp.webp",
    skålsvamp: "skalsvamp.webp",
  };

  return `/images/svampgrupp/${iconMapping[svampGrupp] || "default-icon.webp"}`;
};

const getStatusColor = (status) => {
  const colors = {
    LC: "success",
    NT: "error",
    EN: "error",
    VU: "error",
    CR: "error",
    RE: "error",
    DD: "neutral",
  };
  return colors[status] || "neutral";
};

const getStatusTooltip = (status) => {
  const tooltips = {
    LC: "Livskraftig",
    NT: "Nära hotad",
    EN: "Starkt hotad",
    VU: "Sårbar",
    CR: "Akut hotad",
    RE: "Nationellt utdöd",
    DD: "Kunskapsbrist",
  };
  return tooltips[status] || "Ej bedömd";
};

const sorting = ref([{ id: props.obs, desc: true }])

// const sort = ref({ column: "", direction: "asc" });

const UBadge = resolveComponent('UBadge')
const NuxtImg = resolveComponent('NuxtImg')
const UProgress = resolveComponent('UProgress')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')


const columns = [
{
  accessorKey: "images",
  header: "Bild", // You can leave the header empty or provide an icon/label
  sortable: false,
  cell: ({ row }) => {
    const images = row.getValue("images");
    // If an image exists, render it using NuxtImg; otherwise, render a fallback Icon
    if (images && images.length) {
      return h(resolveComponent('NuxtImg'), {
        src: images[0],
        class: "size-12 object-cover -my-4 rounded-lg border border-neutral-200",
        alt: "Species Image",
        height: "300",
        width: "450",
        format: "webp"
      });
    }
    // return h("div", { 
    //   class: "size-12 -my-4 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700" 
    // }, [
    //   h(resolveComponent('Icon'), { name: "material-symbols:photo", class: "size-5 text-neutral-500" })
    // ]);
  },
  meta: { headerText: 'Bild' },
},

{
  accessorKey: "Commonname",
  header: ({ column }) => {
    const isSorted = column.getIsSorted();
    return h(
      UButton,
      {
        color: 'neutral',
        variant: 'ghost',
        label: 'Namn',
        icon: isSorted
          ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(isSorted === 'asc')
      }
    );
  },
  cell: ({ row }) =>
    h('div', { class: 'text-neutral-700' }, capitalize(row.getValue("Commonname")))
    ,
  meta: { headerText: 'Namn' },
},

{
  accessorKey: "Scientificname",
  header: ({ column }) => {
    const isSorted = column.getIsSorted();
    return h(
      UButton,
      {
        color: 'neutral',
        variant: 'ghost',
        label: 'Latinskt namn',
        icon: isSorted
          ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(isSorted === 'asc')
      }
    );
  },
  // sortable: true,
  cell: ({ row }) => `${row.getValue('Scientificname')}`
  ,
  meta: { headerText: 'Latinskt namn' },
},

{
  accessorKey: props.grupp,
  header: () => h(UDropdownMenu, {
    items: gruppMenuItems.value,
    content: { align: 'start' },
    ui: { content: 'w-48' }
  }, {
    default: () => h(UButton, { label: 'Grupp', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter"  })
  }),
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length === 0) return true;
    return filterValue.includes(row.getValue(columnId));
  },
  cell: ({ row }) => {
    const grupp = row.getValue(props.grupp);
    return grupp !== "Saknas"
      ? h(NuxtImg, {
          src: getIconPath(grupp),
          alt: "Svamp Icon",
          class: "w-6"
        })
      : h(Icon, { name: "heroicons:x-mark-20-solid", class: "size-7" });
  },
  meta: { headerText: 'Grupp' },
},
{
  accessorKey: "mark", // changed from "Mark"
  header: () =>
    h(
      UDropdownMenu,
      {
        items: markMenuItems.value,
        content: { align: "start" },
        ui: { content: "w-48" }
      },
      {
        default: () =>
          h(UButton, {
            label: "Mark",
            variant: "ghost",
            color: "neutral",
            icon: "i-lucide-list-filter"
          })
      }
    ),
  filterFn: (row, filterValue) => {
    // If no mark options are selected, return true (no filtering)
    if (!filterValue || filterValue.length === 0) return true;
    let match = false;
    // Use row.original to check for marks
    if (filterValue.includes("KALKmark") && row.original.KALKmark) match = true;
    if (filterValue.includes("ANNANmark") && row.original.ANNANmark) match = true;
    return match;
  },
  cell: ({ row }) => {
    return h(
      "div",
      { class: "flex items-center space-x-1" },
      [
        row.original.KALKmark && h(UBadge, { color: "kalkmark", variant: "subtle" }, () => "Kalkmark"),
        row.original.ANNANmark && h(UBadge, { color: "vanligmark", variant: "subtle" }, () => "Vanlig skogsmark")
      ].filter(Boolean)
    );
  },
  meta: { headerText: 'Mark' },
},
{
  accessorKey: props.mat,
  header: () => h(UDropdownMenu, {
    items: svampMenuItems.value,
    content: { align: 'start' },
    ui: { content: 'w-48' }
  }, {
    default: () => h(UButton, { label: 'Matsvamp', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter" })
  }),
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length === 0) return true;
    let match = false;
    if (filterValue.includes('Matsvamp')) {
      if (props.mat === "Nyasvamp-boken") {
        match = match || (row.getValue(columnId)?.toLowerCase() === 'x');
      } else {
        match = match || (row.getValue(columnId) === 1);
      }
    }
    if (filterValue.includes('Giftsvamp')) {
      match = match || ((row.original.Giftsvamp || '').toLowerCase() === 'x');
    }
    return match;
  },
  cell: ({ row }) =>
    h('div', { class: 'flex gap-1' }, [
      (props.mat === "Nyasvamp-boken"
        ? row.getValue(props.mat)?.toLowerCase() === 'x'
        : row.getValue(props.mat) === 1) && h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Matsvamp'),
      row.original.Giftsvamp?.toLowerCase() === 'x' && h(UBadge, { color: 'poison', variant: 'subtle' }, () => 'Giftsvamp')
    ].filter(Boolean))
    ,
  meta: { headerText: 'Matsvamp' },
},
{
  accessorKey: 'RL2020kat',
  header: () => h(UDropdownMenu, {
    items: statusMenuItems.value,
    content: { align: 'start' },
    ui: { content: 'w-48' }
  }, {
    default: () => h(UButton, { label: 'Status', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter"  })
  }),
  filterFn: (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true;
  const statusVal = row.getValue(columnId);
  return filterValue.some(filter => {
    if (filter === 'Ej bedömd') {
      return (
        statusVal === 0 ||
        statusVal === '0' ||
        String(statusVal).toUpperCase() === 'NA' ||
        String(statusVal).toUpperCase() === 'NE'
      );
    }
    if (filter === 'Signalart') {
      return row.original.SIGNAL_art === 'S';
    }
    return filter === statusVal;
  });
},
  cell: ({ row }) => {
    const status = row.getValue('RL2020kat');
    const mainBadge = h(
      UBadge,
      { color: getStatusColor(status), variant: 'subtle' },
      () => getStatusTooltip(status)
    );
    const signalBadge =
      row.original.SIGNAL_art === 'S'
        ? h(UBadge, { color: 'signal', variant: 'subtle' }, 'Signalart')
        : null;
    return h('div', { class: 'flex gap-1' }, [mainBadge, signalBadge].filter(Boolean));
  },
  meta: { headerText: 'Status' },
},
{
  accessorKey: props.obs,
  header: ({ column }) => {
    const isSorted = column.getIsSorted();
    return h(
      UButton,
      {
        color: 'neutral',
        variant: 'ghost',
        label: props.obsLabel,
        icon: isSorted
          ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(isSorted === 'asc')
      }
    );
  },
  cell: ({ row, index }) => {
    const progressVal = Number(row.getValue(props.obs));
    const maxVal = Number(sampleEnvCount.value) || 3;
   
    return h(UProgress, {
      modelValue: progressVal,
      max: maxVal,
      // Instead of passing the color prop, use the style attribute to override the CSS variable:
  

      color: allColors.value[index],
      indeterminate: false,

      "onUpdate:modelValue": () => {}
    });
  },
  meta: { headerText: props.obsLabel },
},
];

const topCount = ref(0);
const remainingCount = ref(0);

const data = ref([]);
const isLoading = ref(true);
const allColors = ref([]);

const generateColors = (start, end, steps) => {
  const stepR = (end[0] - start[0]) / (steps - 1);
  const stepG = (end[1] - start[1]) / (steps - 1);
  const stepB = (end[2] - start[2]) / (steps - 1);
  const colors = [];

  for (let i = 0; i < steps; i++) {
    const r = Math.round(start[0] + stepR * i);
    const g = Math.round(start[1] + stepG * i);
    const b = Math.round(start[2] + stepB * i);
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  return colors;
};
const fetchData = async () => {
  if (
    envStore.geography &&
    envStore.forestType &&
    envStore.standAge &&
    envStore.vegetationType
  ) {
    const filename = `${props.dataType}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
    try {
      const response = await fetch(`/${props.dataTypeFolder}/${filename}`);
        if (!response.ok)
        throw new Error(`Failed to fetch data from ${filename}`);
      data.value = await response.json();

      // Once data is fetched, turn off loading
      isLoading.value = false;

      // 1) Assign each row a stable colorIndex based on its original position
      data.value.forEach((row, i) => {
        row.colorIndex = i;
      });

      // 2) Figure out how many total species we have
      const totalSpecies = data.value.length;

      // 3) Use your existing logic for topCount (10% in your case)
      topCount.value = Math.floor(totalSpecies * 0.1);
      remainingCount.value = totalSpecies - topCount.value;

      // 4) Generate the color arrays
      const grayColors = generateColors(
        [82, 82, 82],
        [212, 212, 212],
        topCount.value
      );
      const rainbowColors = generateRainbowColors(remainingCount.value);

      // 5) Combine them into one big array
      allColors.value = [...grayColors, ...rainbowColors];
    } catch (error) {
      console.error("Error fetching data:", error);
      data.value = [];   // Ensure data is cleared if fetch fails
      isLoading.value = false;
    }
  }
};

// Helper function to generate rainbow colors
function generateRainbowColors(steps) {
  const colors = [];
  const saturation = 70; // Adjust for vibrancy
  const lightness = 50; // Adjust for brightness

  for (let i = 0; i < steps; i++) {
    // Calculate hue from 30° (orange) to 330° (red)
    const hue = 45 + (300 / (steps - 1 || 1)) * i;
    colors.push(`hsl(${hue % 360}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

const envStore = useEnvParamsStore();

watch(
  () => [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ],
  () => {
    // Clear previous data and show loading state immediately when parameters change
    data.value = [];
    isLoading.value = true;
    fetchData();
  },
  { immediate: true }
);

const searchQuery = ref("");


const filteredData = computed(() => {
  let result = data.value;

  // Apply global search filtering
  if (searchQuery.value) {
    result = result.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }

  // Apply edible/poison filtering if specified via props
  if (props.filterEdible) {
    result = result.filter(row => {
      const edibleVal = row[props.mat];
      return edibleVal && String(edibleVal).toLowerCase() === 'x';
    });
  } else if (props.filterPoison) {
    result = result.filter(row => {
      const edibleVal = row[props.mat];
      return !(edibleVal && String(edibleVal).toLowerCase() === 'x');
    });
  }

  return result;
});

// const sorting = ref([{ id: props.obs, desc: false }])

// const sortedData = computed(() => {
//   let result = filteredData.value.slice(); // Create a shallow copy to sort

//   if (sort.value && sort.value.column) {
//     const column = sort.value.column;
//     const direction = sort.value.direction;

//     result.sort((a, b) => {
//       const valueA = a[column];
//       const valueB = b[column];

//       // Handle null or undefined values
//       if (valueA == null && valueB != null) return 1;
//       if (valueA != null && valueB == null) return -1;
//       if (valueA == null && valueB == null) return 0;

//       // Compare values using Swedish locale
//       const comparison = String(valueA).localeCompare(String(valueB), "sv", {
//         numeric: true,
//         sensitivity: "base",
//       });

//       return direction === "asc" ? comparison : -comparison;
//     });
//   }

//   return result;
// });
// const totalItems = computed(() => filteredData.value.length);

watch(rowsPerPage, (newVal) => {
  let newPageSize =
    newVal === "Alla" ? totalItems.value || data.value.length : Number(newVal);
  // Update our reactive pagination object:
  pagination.value.pageSize = newPageSize;
  pagination.value.pageIndex = 0;
  // Force the table to update by calling its API methods:
  if (table.value?.tableApi) {
    table.value.tableApi.setPageSize(newPageSize);
    table.value.tableApi.setPageIndex(0);
  }
});

const currentPaginationRows = computed(() => {
  return table.value?.tableApi?.getPaginationRowModel().rows || [];
});

const paginationState = computed(() => table.value?.tableApi?.getState().pagination || { pageIndex: 0, pageSize: 10 });

const startItem = computed(() => {
  // Start index is based on the current page index and page size
  return (paginationState.value.pageIndex * paginationState.value.pageSize) + 1;
});

const endItem = computed(() => {
  // End index is the start plus the number of rows in the current page
  const end = (paginationState.value.pageIndex * paginationState.value.pageSize) + currentPaginationRows.value.length;
  // Ensure end doesn't exceed the total number of filtered items
  return end > totalItems.value ? totalItems.value : end;
});

const totalItems = computed(() => {
  return table.value?.tableApi?.getFilteredRowModel().rows.length || 0;
});

const columnFilters = computed(() => {
  const filters = [];
  if (selectedFilter.value && selectedFilter.value.length > 0) {
    filters.push({ id: props.mat, value: selectedFilter.value });
  }
  if (selectedStatus.value && selectedStatus.value.length > 0) {
    filters.push({ id: 'RL2020kat', value: selectedStatus.value });
  }
  if (selectedGrupp.value && selectedGrupp.value.length > 0) {
    filters.push({ id: props.grupp, value: selectedGrupp.value });
  }
  if (selectedMark.value && selectedMark.value.length > 0) {
    filters.push({ id: "mark", value: selectedMark.value });
  }
  return filters;
});

watch(columnFilters, (newFilters) => {
  if (table.value?.tableApi) {
    table.value.tableApi.setColumnFilters(newFilters);
  }
});
</script>

<style scoped>
/* For Webkit browsers like Chrome, Safari */

/* Hide scrollbar for IE, Edge and Firefox */
#scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

#scrollbar::-webkit-scrollbar-thumb {
  display: none;
  background-color: #6f202033; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
}

#scrollbar:hover::-webkit-scrollbar-thumb {
  display: block;
}

/* For Firefox */
#scrollbar {
  scrollbar-width: medium;
  scrollbar-color: #88888800 #f2f3f500;
  transition: scrollbar-color 1s ease-in-out; /* transition effect for Firefox */
}
</style>
