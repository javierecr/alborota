import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/**
 * Tracks the active slide of a CSS scroll-snap track and scrolls to a given one.
 *
 * The carousel itself is pure CSS, so the markup renders correctly from the
 * server with no JS; this only adds the indicator state and programmatic jumps.
 */
export const useSnapCarousel = (track: Ref<HTMLElement | null>) => {
  const activeIndex = ref(0);
  let frame = 0;

  const prefersReducedMotion = () =>
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const measure = () => {
    const el = track.value;
    if (!el || !el.clientWidth) return;
    activeIndex.value = Math.round(el.scrollLeft / el.clientWidth);
  };

  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  };

  const scrollTo = (index: number, behavior?: ScrollBehavior) => {
    const el = track.value;
    if (!el) return;
    el.scrollTo({
      left: index * el.clientWidth,
      behavior: behavior ?? (prefersReducedMotion() ? 'auto' : 'smooth'),
    });
    // Keep the indicator honest even when the scroll is a no-op (single slide).
    activeIndex.value = index;
  };

  onMounted(() => {
    const el = track.value;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    measure();
  });

  onBeforeUnmount(() => {
    track.value?.removeEventListener('scroll', onScroll);
    if (frame) cancelAnimationFrame(frame);
  });

  return { activeIndex, scrollTo };
};
