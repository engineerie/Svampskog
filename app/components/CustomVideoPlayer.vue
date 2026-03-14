<template>
  <div ref="containerRef" class="relative w-full h-full bg-muted rounded-lg overflow-hidden"
    @mouseenter="isContainerHovered = true" @mouseleave="isContainerHovered = false">
    <video
      ref="videoRef"
      class="block size-full cursor-pointer object-cover object-center"
      playsinline
      preload="metadata"
      :poster="poster"
      @click="togglePlay">
      <source :src="src" type="video/mp4">
      Din webbläsare stödjer inte videouppspelning.
    </video>

    <div
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200"
      :class="isBuffering ? 'opacity-100' : 'opacity-0'">
      <UIcon name="i-mingcute-loading-line" class="size-16 animate-spin text-neutral-500" />
    </div>

    <div ref="controlsRef"
      class="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-neutral-50/70 via-neutral-50/30 to-transparent p-2 sm:p-3 transition-all duration-300 ease-out"
      :class="controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'"
      @focusin="isControlsFocused = true" @focusout="onControlsFocusOut">
      <div class="mx-auto flex w-full max-w-4xl items-center gap-2 sm:gap-3 text-neutral-700">
        <UButton type="button" variant="ghost" color="neutral"
          class="inline-flex size-9 items-center justify-center rounded-md" @click="togglePlay">
          <UIcon :name="isPlaying ? 'i-heroicons-pause-20-solid' : 'i-heroicons-play-20-solid'" class="size-5" />
        </UButton>

        <UPopover mode="hover" :content="{ side: 'top', align: 'center' }"
          :ui="{ content: 'p-4 bg-elevated ring-muted/50' }">
          <UButton type="button" variant="ghost" color="neutral"
            class="inline-flex size-9 items-center justify-center rounded-md" @click="toggleMute">
            <UIcon
              :name="isMuted || volume === 0 ? 'i-heroicons-speaker-x-mark-20-solid' : 'i-heroicons-speaker-wave-20-solid'"
              class="size-5" />
          </UButton>
          <template #content>
            <USlider v-model="volume" orientation="vertical" :min="0" :max="1" :step="0.01" color="neutral"
              class="h-24 w-full" size="xs" aria-label="Volym" @update:model-value="onVolumeChange" />
          </template>
        </UPopover>

        <span class="min-w-12 text-xs sm:text-sm tabular-nums">{{ formattedCurrentTime }}</span>

        <div class="relative flex-1 h-8 flex items-center cursor-crosshair" @mouseenter="isScrubberHovering = true"
          @mouseleave="onScrubberLeave" @mousemove="onScrubberHover" @pointerdown.prevent="onScrubberPointerDown"
          @pointermove="onScrubberPointerMove">
          <div v-if="isScrubberHovering"
            class="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-elevated px-2 py-0.5 text-[12px] text-neutral-800 ring ring-muted/50 tabular-nums whitespace-nowrap"
            :style="{ left: `${scrubberHoverPercent}%` }">
            {{ scrubberHoverLabel }}
          </div>
          <div v-if="isScrubberHovering"
            class="pointer-events-none absolute -top-0.5 bottom-0 w-px bg-neutral-700/70 -translate-x-1/2"
            :style="{ left: `${scrubberHoverPercent}%` }" />
          <input :value="progressValue" type="range" min="0" :max="duration || 0" step="0.1" aria-label="Spola video"
            :class="[
              'video-scrubber w-full origin-center transition-transform duration-200 ease-out',
              isScrubThicknessActive ? 'scale-y-[3]' : 'scale-y-100'
            ]" :style="scrubberStyle" @input="onSeek">
        </div>
        <UPopover v-model:open="speedPopoverOpen" :content="{ side: 'top', align: 'center' }"
          :ui="{ content: 'p-1 bg-elevated ring-muted/50' }">
          <UButton type="button" variant="ghost" color="neutral"
            class="inline-flex items-center justify-center gap-1 rounded-md px-2.5 h-9 text-xs sm:text-sm">
            <span>{{ playbackRateLabel }}</span>
          </UButton>
          <template #content>
            <div class="flex flex-col gap-1 min-w-16">
              <UButton v-for="speed in speedOptions" :key="speed" type="button" variant="ghost" color="neutral"
                size="sm" class="text-xs items-center"
                :class="playbackRate === speed ? 'bg-muted text-neutral-900 hover:bg-muted' : 'hover:bg-muted hover:text-neutral-900 transition-colors'"
                @click="setPlaybackRate(speed)">
                {{ speed }}x
              </UButton>
            </div>
          </template>
        </UPopover>
        <UButton type="button" variant="ghost" color="neutral"
          class="inline-flex size-9 items-center justify-center rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasTextTracks" @click="toggleSubtitles">
          <UIcon
            :name="subtitlesEnabled ? 'i-heroicons-chat-bubble-bottom-center-text-solid' : 'i-heroicons-chat-bubble-bottom-center-text'"
            class="size-5" />
        </UButton>


        <UButton type="button" variant="ghost" color="neutral"
          class="inline-flex size-9 items-center justify-center rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canUsePictureInPicture" @click="togglePictureInPicture">
          <UIcon name="i-fluent-picture-in-picture-32-regular" class="size-5" />
        </UButton>
        <UButton type="button" variant="ghost" color="neutral"
          class="inline-flex size-9 items-center justify-center rounded-md" @click="toggleFullscreen">
          <UIcon :name="isFullscreen ? 'i-ph-arrows-in-simple-bold' : 'i-ph-arrows-out-simple-bold'" class="size-5" />
        </UButton>


      </div>
    </div>
    <span v-if="subtitlesEnabled && activeSubtitleText"
      class="pointer-events-none absolute inset-x-0 z-20 px-3 text-center text-neutral-800 transition-all duration-300 ease-out"
      :class="controlsVisible ? 'bottom-18 sm:bottom-20' : 'bottom-4 sm:bottom-6'" aria-live="polite">
      <span
        class="inline-block rounded-md bg-elevated ring ring-muted/50 px-3 py-1.5 text-2xl leading-snug whitespace-pre-line">
        {{ activeSubtitleText }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  poster?: string
  subtitlesSrc?: string
}>(), {
  poster: '',
  subtitlesSrc: ''
})

const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const playbackRate = ref(1)
const speedPopoverOpen = ref(false)
const isContainerHovered = ref(false)
const isControlsFocused = ref(false)
const isTouchLikeDevice = ref(false)
const isBuffering = ref(false)
const subtitlesEnabled = ref(true)
const activeSubtitleText = ref('')
type SubtitleCue = { start: number; end: number; text: string }
const subtitleCues = ref<SubtitleCue[]>([])
const isScrubbing = ref(false)
const isScrubThicknessActive = ref(false)
let scrubThicknessTimeout: ReturnType<typeof setTimeout> | null = null

const speedOptions = [0.75, 1, 1.25, 1.5, 2]

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const progressValue = computed(() => Math.min(currentTime.value, duration.value || 0))
const playbackRateLabel = computed(() => `${playbackRate.value}x`)
const isScrubberHovering = ref(false)
const scrubberHoverPercent = ref(0)
const scrubberHoverTime = ref(0)
const scrubberHoverLabel = computed(() => `${formatTime(scrubberHoverTime.value)} / ${formatTime(duration.value)}`)
const scrubberStyle = computed(() => {
  const max = duration.value || 0
  const value = Math.min(progressValue.value, max)
  const percent = max > 0 ? (value / max) * 100 : 0
  return {
    background: `linear-gradient(to right, #885b46 0%, #885b46 ${percent}%, rgba(136,91,70,0.3) ${percent}%, rgba(136,91,70,0.3) 100%)`,
    accentColor: '#885b46'
  }
})
const controlsVisible = computed(() => {
  if (isTouchLikeDevice.value) return true
  if (!isPlaying.value) return true
  return isContainerHovered.value || isControlsFocused.value || isScrubberHovering.value || isScrubbing.value
})
const hasTextTracks = computed(() => subtitleCues.value.length > 0)
const canUsePictureInPicture = computed(() => {
  if (typeof document === 'undefined') return false
  const el = videoRef.value as HTMLVideoElement & { disablePictureInPicture?: boolean } | null
  return !!(document.pictureInPictureEnabled && el && !el.disablePictureInPicture)
})

const updateTime = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime || 0
  updateActiveSubtitleText(currentTime.value)
}

const updateDuration = () => {
  if (!videoRef.value) return
  duration.value = Number.isFinite(videoRef.value.duration) ? videoRef.value.duration : 0
}

const updatePlayState = () => {
  isPlaying.value = !!videoRef.value && !videoRef.value.paused
  if (!isPlaying.value) {
    isBuffering.value = false
  }
}

const updateVolumeState = () => {
  if (!videoRef.value) return
  volume.value = videoRef.value.volume
  isMuted.value = videoRef.value.muted || videoRef.value.volume === 0
}

const updateRateState = () => {
  if (!videoRef.value) return
  playbackRate.value = videoRef.value.playbackRate
}

const startBuffering = () => {
  if (!videoRef.value) return
  if (!videoRef.value.paused) {
    isBuffering.value = true
  }
}

const stopBuffering = () => {
  isBuffering.value = false
}

const handleFullscreenChange = () => {
  if (typeof document === 'undefined') return
  isFullscreen.value = !!document.fullscreenElement
}

const togglePlay = async () => {
  if (!videoRef.value) return
  if (!videoRef.value.paused) {
    videoRef.value.pause()
    return
  }

  try {
    const request = videoRef.value.play()
    if (request && typeof request.then === 'function') {
      await request
    }
  } catch (error) {
    const domError = error as DOMException
    if (domError?.name !== 'AbortError') {
      console.error('Video play failed:', error)
    }
  } finally {
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  updateVolumeState()
}

const onVolumeChange = () => {
  if (!videoRef.value) return
  videoRef.value.volume = volume.value
  videoRef.value.muted = volume.value === 0
  updateVolumeState()
}

const onSeek = (event: Event) => {
  if (!videoRef.value) return
  const value = Number((event.target as HTMLInputElement).value)
  videoRef.value.currentTime = value
  currentTime.value = value
}

const onScrubberHover = (event: MouseEvent) => {
  const element = event.currentTarget as HTMLElement | null
  if (!element) return
  updateScrubberPositionFromClientX(element, event.clientX)
}

const onScrubberLeave = () => {
  if (isScrubbing.value) return
  isScrubberHovering.value = false
}

const updateScrubberPositionFromClientX = (element: HTMLElement, clientX: number) => {
  const rect = element.getBoundingClientRect()
  if (!rect.width) return
  const clampedX = Math.min(Math.max(clientX - rect.left, 0), rect.width)
  const percent = (clampedX / rect.width) * 100
  scrubberHoverPercent.value = percent
  scrubberHoverTime.value = (duration.value || 0) * (percent / 100)
}

const seekToHoverPosition = () => {
  if (!videoRef.value) return
  const targetTime = Math.min(Math.max(scrubberHoverTime.value, 0), duration.value || 0)
  videoRef.value.currentTime = targetTime
  currentTime.value = targetTime
}

const onScrubberPointerDown = (event: PointerEvent) => {
  const element = event.currentTarget as HTMLElement | null
  if (!element) return
  isScrubberHovering.value = true
  isScrubbing.value = true
  if (scrubThicknessTimeout) clearTimeout(scrubThicknessTimeout)
  scrubThicknessTimeout = setTimeout(() => {
    if (isScrubbing.value) {
      isScrubThicknessActive.value = true
    }
  }, 140)
  element.setPointerCapture(event.pointerId)
  updateScrubberPositionFromClientX(element, event.clientX)
  seekToHoverPosition()
}

const onScrubberPointerMove = (event: PointerEvent) => {
  if (!isScrubbing.value) return
  const element = event.currentTarget as HTMLElement | null
  if (!element) return
  updateScrubberPositionFromClientX(element, event.clientX)
  seekToHoverPosition()
}

const stopScrubbing = () => {
  if (!isScrubbing.value) return
  isScrubbing.value = false
  if (scrubThicknessTimeout) {
    clearTimeout(scrubThicknessTimeout)
    scrubThicknessTimeout = null
  }
  isScrubThicknessActive.value = false
  if (!isContainerHovered.value) {
    isScrubberHovering.value = false
  }
}

const toggleSubtitles = () => {
  if (!subtitleCues.value.length) return
  subtitlesEnabled.value = !subtitlesEnabled.value
  updateActiveSubtitleText(currentTime.value)
}

const updateActiveSubtitleText = (timeInSeconds: number) => {
  if (!subtitlesEnabled.value) {
    activeSubtitleText.value = ''
    return
  }
  const cue = subtitleCues.value.find((item) => timeInSeconds >= item.start && timeInSeconds <= item.end)
  activeSubtitleText.value = cue?.text || ''
}

const parseVttTimestamp = (value: string) => {
  const trimmed = value.trim().replace(',', '.')
  const parts = trimmed.split(':').map(Number)
  if (parts.some((part) => Number.isNaN(part))) return NaN
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  }
  return NaN
}

const parseVtt = (raw: string): SubtitleCue[] => {
  const lines = raw.replace(/\r/g, '').split('\n')
  const cues: SubtitleCue[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line || line === 'WEBVTT') {
      index += 1
      continue
    }

    let timeLine = line
    if (!line.includes('-->')) {
      index += 1
      timeLine = (lines[index] || '').trim()
    }
    if (!timeLine.includes('-->')) {
      index += 1
      continue
    }

    const [startRaw, endRawWithSettings] = timeLine.split('-->')
    const [endRaw] = endRawWithSettings.trim().split(/\s+/)
    const start = parseVttTimestamp(startRaw)
    const end = parseVttTimestamp(endRaw)
    index += 1

    const textLines: string[] = []
    while (index < lines.length && lines[index].trim() !== '') {
      textLines.push(lines[index])
      index += 1
    }

    if (Number.isFinite(start) && Number.isFinite(end) && textLines.length) {
      cues.push({
        start,
        end,
        text: textLines.join('\n')
      })
    }
    index += 1
  }

  return cues
}

const loadSubtitles = async () => {
  const subtitlePath = (props.subtitlesSrc || '').trim()
  if (!subtitlePath) {
    subtitleCues.value = []
    subtitlesEnabled.value = false
    return
  }
  try {
    const response = await fetch(subtitlePath)
    if (!response.ok) throw new Error(`Failed to load subtitles: ${response.status}`)
    const raw = await response.text()
    subtitleCues.value = parseVtt(raw)
    if (!subtitleCues.value.length) subtitlesEnabled.value = false
  } catch (error) {
    subtitleCues.value = []
    subtitlesEnabled.value = false
    console.error('Subtitle loading failed:', error)
  }
}

const onPageShow = () => {
  if (!subtitleCues.value.length) {
    loadSubtitles()
  }
}

const onControlsFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget as Node | null
  if (!nextTarget || !controlsRef.value?.contains(nextTarget)) {
    isControlsFocused.value = false
  }
}

const setPlaybackRate = (rate: number) => {
  if (!videoRef.value) return
  videoRef.value.playbackRate = rate
  updateRateState()
  speedPopoverOpen.value = false
}

const toggleFullscreen = async () => {
  if (typeof document === 'undefined') return
  if (!containerRef.value) return
  if (!document.fullscreenElement) await containerRef.value.requestFullscreen()
  else await document.exitFullscreen()
}

const togglePictureInPicture = async () => {
  if (typeof document === 'undefined') return
  if (!videoRef.value || !canUsePictureInPicture.value) return
  const pipVideo = document.pictureInPictureElement as HTMLVideoElement | null
  if (pipVideo && pipVideo === videoRef.value) {
    await document.exitPictureInPicture()
  } else {
    await videoRef.value.requestPictureInPicture()
  }
}

const formatTime = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(value))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

onMounted(() => {
  if (typeof document === 'undefined') return
  if (!videoRef.value) return
  videoRef.value.addEventListener('timeupdate', updateTime)
  videoRef.value.addEventListener('loadedmetadata', updateDuration)
  videoRef.value.addEventListener('durationchange', updateDuration)
  videoRef.value.addEventListener('play', updatePlayState)
  videoRef.value.addEventListener('pause', updatePlayState)
  videoRef.value.addEventListener('ended', updatePlayState)
  videoRef.value.addEventListener('volumechange', updateVolumeState)
  videoRef.value.addEventListener('ratechange', updateRateState)
  videoRef.value.addEventListener('waiting', startBuffering)
  videoRef.value.addEventListener('stalled', startBuffering)
  videoRef.value.addEventListener('seeking', startBuffering)
  videoRef.value.addEventListener('playing', stopBuffering)
  videoRef.value.addEventListener('canplay', stopBuffering)
  videoRef.value.addEventListener('canplaythrough', stopBuffering)
  videoRef.value.addEventListener('seeked', stopBuffering)
  videoRef.value.addEventListener('ended', stopBuffering)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('pointerup', stopScrubbing)
  window.addEventListener('pointercancel', stopScrubbing)
  window.addEventListener('pageshow', onPageShow)
  isTouchLikeDevice.value = window.matchMedia('(hover: none), (pointer: coarse)').matches

  updateDuration()
  updatePlayState()
  updateVolumeState()
  updateRateState()
  loadSubtitles()
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  if (scrubThicknessTimeout) {
    clearTimeout(scrubThicknessTimeout)
    scrubThicknessTimeout = null
  }
  if (videoRef.value) {
    videoRef.value.removeEventListener('timeupdate', updateTime)
    videoRef.value.removeEventListener('loadedmetadata', updateDuration)
    videoRef.value.removeEventListener('durationchange', updateDuration)
    videoRef.value.removeEventListener('play', updatePlayState)
    videoRef.value.removeEventListener('pause', updatePlayState)
    videoRef.value.removeEventListener('ended', updatePlayState)
    videoRef.value.removeEventListener('volumechange', updateVolumeState)
    videoRef.value.removeEventListener('ratechange', updateRateState)
    videoRef.value.removeEventListener('waiting', startBuffering)
    videoRef.value.removeEventListener('stalled', startBuffering)
    videoRef.value.removeEventListener('seeking', startBuffering)
    videoRef.value.removeEventListener('playing', stopBuffering)
    videoRef.value.removeEventListener('canplay', stopBuffering)
    videoRef.value.removeEventListener('canplaythrough', stopBuffering)
    videoRef.value.removeEventListener('seeked', stopBuffering)
    videoRef.value.removeEventListener('ended', stopBuffering)
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('pointerup', stopScrubbing)
  window.removeEventListener('pointercancel', stopScrubbing)
  window.removeEventListener('pageshow', onPageShow)
})
</script>

<style scoped>
.video-scrubber {
  appearance: none;
  -webkit-appearance: none;
  height: 2px;
  border-radius: 9999px;
  cursor: crosshair;
}

.video-scrubber::-webkit-slider-runnable-track {
  height: 2px;
  border-radius: 9999px;
  background: transparent;
}

.video-scrubber::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.video-scrubber::-moz-range-track {
  height: 2px;
  border-radius: 9999px;
  background: rgba(136, 91, 70, 0.3);
}

.video-scrubber::-moz-range-progress {
  height: 2px;
  border-radius: 9999px;
  background: #885b46;
}

.video-scrubber::-moz-range-thumb {
  width: 0;
  height: 0;
  border: 0;
  background: transparent;
}
</style>
