import { onBeforeUnmount, onMounted, toValue, watch, type MaybeRefOrGetter } from 'vue';

/**
 * Locks page scrolling, keeping the scroll position so closing an overlay
 * doesn't jump the page to the top.
 *
 * Called with no argument it locks for as long as the calling component is
 * mounted (the original behaviour, used by ProductMediaLightbox). Pass a ref or
 * getter to drive the lock from state instead — CartPopup is always mounted and
 * only locks while it is open *and* on mobile.
 */
export const useBodyScrollLock = (enabled: MaybeRefOrGetter<boolean> = true) => {
  let scrollY = 0;
  let previous: { position: string; top: string; width: string; overflow: string } | null = null;

  const lock = () => {
    if (!import.meta.client || previous) return;
    const { body } = document;
    scrollY = window.scrollY;
    previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
  };

  // Idempotent: the watcher and onBeforeUnmount can both reach it, and only the
  // first call may restore the scroll position.
  const unlock = () => {
    if (!import.meta.client || !previous) return;
    const { body } = document;
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.width = previous.width;
    body.style.overflow = previous.overflow;
    previous = null;
    window.scrollTo(0, scrollY);
  };

  // Not `immediate`, so nothing touches `document` during SSR; onMounted covers
  // the first paint for the default always-on case.
  watch(() => toValue(enabled), on => (on ? lock() : unlock()));
  onMounted(() => { if (toValue(enabled)) lock(); });
  onBeforeUnmount(unlock);
};
