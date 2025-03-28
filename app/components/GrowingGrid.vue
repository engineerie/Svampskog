<template>
    <div class="grid grid-cols-8 gap-4 p-4">
      <NuxtImg
        v-for="(src, index) in images"
        :key="src"
        :src="src"
        alt="Svampgrid image"
        class="grid-image rounded-lg shadow w-full"
        loading="lazy"
        width="800"
        height="800"
        :style="{ transitionDelay: delays[index] + 'ms' }"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'



  const images = [

  '/images/LandingPage/Amanita ceciliae-37.jpg',
'/images/LandingPage/Amanita muscaria-28-2976.jpg',
'/images/LandingPage/Amanita pantherina-183-2978.jpg',
// '/images/LandingPage/Boletus edulis-6.jpg',
// '/images/LandingPage/Cantharellus cibarius-3.jpg',
// '/images/LandingPage/Coprinus comatus-2.jpg',
// '/images/LandingPage/Cortinarius gentilis-135-3622.jpg',
// '/images/LandingPage/Cortinarius sanguineus-179-.jpg',
// '/images/LandingPage/Craterellus cornucopioides-2.jpg',
// '/images/LandingPage/Craterellus lutescens-2.jpg',
// '/images/LandingPage/Craterellus tubaeformis-1.jpg',
'/images/LandingPage/Flammulina velutipes-2.jpg',
'/images/LandingPage/Galerina marginata-64-4158.jpg',
// '/images/LandingPage/Gomphus clavatus-1.jpg',
'/images/LandingPage/Hydnellum caeruleum-4362.jpg',
// '/images/LandingPage/Hygrocybe intermedia-801.jpg',
'/images/LandingPage/Hygrocybe ovina-804.jpg',
'/images/LandingPage/Hygrophorus camarophyllus-3.jpg',
'/images/LandingPage/Inocybe erubescens-80-4581.jpg',
// '/images/LandingPage/Inocybe geophylla-94-4586.jpg',
'/images/LandingPage/Inocybe lilacina-140-236498.jpg',
'/images/LandingPage/Leccinum spp-58-.jpg',
// '/images/LandingPage/Phellodon connatus-5448.jpg',
'/images/LandingPage/Ramaria mairei, Ramaria pallida-185-256756.jpg',
'/images/LandingPage/Russula xerampelina.jpg',
'/images/LandingPage/Sarcosoma globosum-1445.jpg',
'/images/LandingPage/Tricholoma matsutake-166-6276.jpg',
'/images/LandingPage/Tricholoma virgatum-60-.jpg',
'/images/LandingPage/Amanita ceciliae-37.jpg',
'/images/LandingPage/Amanita muscaria-28-2976.jpg',
'/images/LandingPage/Amanita pantherina-183-2978.jpg',
// '/images/LandingPage/Boletus edulis-6.jpg',
'/images/LandingPage/Cantharellus cibarius-3.jpg',
'/images/LandingPage/Coprinus comatus-2.jpg',
'/images/LandingPage/Cortinarius gentilis-135-3622.jpg',
'/images/LandingPage/Cortinarius sanguineus-179-.jpg',
'/images/LandingPage/Craterellus cornucopioides-2.jpg',
// '/images/LandingPage/Craterellus lutescens-2.jpg',
'/images/LandingPage/Craterellus tubaeformis-1.jpg',
'/images/LandingPage/Flammulina velutipes-2.jpg',
'/images/LandingPage/Galerina marginata-64-4158.jpg',
// '/images/LandingPage/Gomphus clavatus-1.jpg',
'/images/LandingPage/Hydnellum caeruleum-4362.jpg',
// '/images/LandingPage/Hygrocybe intermedia-801.jpg',
'/images/LandingPage/Hygrocybe ovina-804.jpg',
'/images/LandingPage/Hygrophorus camarophyllus-3.jpg',
'/images/LandingPage/Inocybe erubescens-80-4581.jpg',
// '/images/LandingPage/Inocybe geophylla-94-4586.jpg',
'/images/LandingPage/Inocybe lilacina-140-236498.jpg',
'/images/LandingPage/Leccinum spp-58-.jpg',
// '/images/LandingPage/Phellodon connatus-5448.jpg',
'/images/LandingPage/Ramaria mairei, Ramaria pallida-185-256756.jpg',
'/images/LandingPage/Russula xerampelina.jpg',
'/images/LandingPage/Sarcosoma globosum-1445.jpg',
'/images/LandingPage/Tricholoma matsutake-166-6276.jpg',
'/images/LandingPage/Tricholoma virgatum-60-.jpg',
'/images/LandingPage/Tuber mesentericum-6308.jpg',
'/images/LandingPage/Tulostoma niveum-1616.jpg',
  ]
  
  const images2 = [
    '/images/LandingPage/Inocybe erubescens-80-4581.jpg',

    '/images/LandingPage/Galerina marginata-64-4158.jpg',
  '/images/LandingPage/Flammulina velutipes-2.jpg',
'/images/LandingPage/Hydnellum caeruleum-4362.jpg',
  '/images/LandingPage/Tuber mesentericum-6308.jpg',
'/images/LandingPage/Tulostoma niveum-1616.jpg',
  ]

 
  
  // Compute a random delay (0-300ms) for each image
  const delays = images.map(() => Math.floor(Math.random() * 500))
  
  onMounted(() => {
    const gridImages = document.querySelectorAll('.grid-image')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
  
    gridImages.forEach(image => {
      observer.observe(image)
    })
  })
  </script>
  
  <style scoped>
  .grid-image {
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  }
  .grid-image.in-view {
    opacity: 1;
    transform: scale(1);
  }
  </style>