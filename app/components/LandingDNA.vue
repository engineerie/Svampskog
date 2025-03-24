<template>
  <div class="items-center">
    <div class="relative px-10 mb-8">
      <img
        src="/images/Markinventeringen.svg
      "
      />
    </div>
    <div class="">
      <UBadge
        icon="i-material-symbols-location-on-outline"
        size="md"
        color="primary"
        variant="subtle"
        :ui="{}"
        class="my-2"
      >
        <Icon name="solar:dna-linear" class="text-violet-500 mr-1" />
        Alla mykorrhizasvampar
      </UBadge>
      <h1
        size=""
        class="text-neutral-950 dark:text-neutral-200 text-xl md:text-2xl"
      >
        DNA-analys av jordprover
      </h1>
      <!-- <h1
        lead="tight"
        size="2xl"
        class="text-primary-500 dark:text-neutral-200 mb-1"
      >
        av jordprover
      </h1> -->
      <!-- Description -->

      <h1
        weight="semi-bold"
        size=""
        class="text-neutral-500 dark:text-neutral-400 mb-6 text-md md:text-lg"
      >
        Sedan 2015 samlar
        <NuxtLink
          to="https://www.slu.se/centrumbildningar-och-projekt/markinventeringen/"
          class="text-primary-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Markinventeringen</NuxtLink
        >
        tillsammans med
        <NuxtLink
          to="https://www.slu.se/centrumbildningar-och-projekt/riksskogstaxeringen/"
          class="text-primary-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          SLU Rikskogstaxeringen</NuxtLink
        >
        årligen in markprover som DNA-analyseras för att identifiera och
        undersöka svampar i skogsmark. Hittills har prover från 2500 skogar runt
        om i Sverige analyserats. Resultaten ger en bra bild av förekomsten av
        vanliga mykorrhizasvampar.
        <!-- Denna stickprovsundersökning fångar dock inte
        upp ovanligare arter, eftersom dessa ofta är lokalt begränsade och
        sällan förekommer i de små proverna. -->
      </h1>
      <div class="flex items-start">
        <!-- Navigation Buttons -->
        <div class="flex gap-5">
          <!-- <NuxtLink to="/mykorrhizasvampar">
            <UButton color="primary" size="md" shape="full">
              <Icon name="mdi:file-cog-outline" class="-ms-1 mr-1 size-5" />
              <span>Läs dokumentation</span>
            </UButton>
          </NuxtLink> -->
          <!-- <NuxtLink to="https://svamparisverige.se/" target="blank">
            <UButton color="default" type="outline" size="md" shape="full">
              <Icon
                name="mingcute:external-link-line"
                class="-ms-1 mr-1 size-6"
              />
              <span>Mer på svamparisverige.se</span>
            </UButton>
          </NuxtLink> -->
        </div>
      </div>
    </div>
  </div>
</template>
