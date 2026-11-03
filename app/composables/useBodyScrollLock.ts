import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Locks page scrolling for as long as the calling component is mounted, keeping
 * the scroll position so closing an overlay doesn't jump the page to the top.
 */
export const useBodyScrollLock = () => {
  let scrollY = 0;
  let previous: { position: string; top: string; width: string; overflow: string } | null = null;

  onMounted(() => {
    if (!import.meta.client) return;
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
  });

  onBeforeUnmount(() => {
    if (!import.meta.client || !previous) return;
    const { body } = document;
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.width = previous.width;
    body.style.overflow = previous.overflow;
    previous = null;
    window.scrollTo(0, scrollY);
  });
};
