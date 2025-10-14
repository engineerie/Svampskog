import { reactive, toRefs } from 'vue'

export type OverlayPopoverAnchor = { x: number; y: number; width: number; height: number }

type AnchorState = OverlayPopoverAnchor | null

type ShowTarget = HTMLElement | OverlayPopoverAnchor

const state = reactive({
  open: false,
  key: null as string | null,
  anchor: null as AnchorState
})

function resolveAnchor(target: ShowTarget): OverlayPopoverAnchor {
  if (target instanceof HTMLElement) {
    const rect = target.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  }
  return target
}

export function useOverlayPopover() {
  function show(key: string, target: ShowTarget) {
    const anchorRect = resolveAnchor(target)
    state.key = key
    state.anchor = anchorRect
    state.open = true
  }

  function hide() {
    state.open = false
    state.key = null
    state.anchor = null
  }

  return { ...toRefs(state), show, hide }
}
