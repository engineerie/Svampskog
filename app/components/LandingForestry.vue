<template>
  <div class="relative w-full h-auto rounded-lg overflow-hidden">
    <!-- Underlying image -->
    <NuxtImg
      class="w-full h-auto"
      src="/images/LandningSkogsbruk/trakthygge_efter_visa_visa_produktionsskog_.png"
      format="webp"
      height="400"
      width="650"
    />
    <!-- Top image with rolling fade animation -->
    <NuxtImg
      class="absolute top-0 left-0 w-full h-auto rolling-fade"
      src="/images/LandningSkogsbruk/trakthygge_före_visa_visa_naturskog.png"
      format="webp"
      height="400"
      width="650"
    />
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}

.rolling-fade {
  animation: rollFade 10s infinite;
}

@keyframes rollFade {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>