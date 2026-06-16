<script setup>
const props = defineProps({
  embed: { type: Object, default: null },
  canPlay: { type: Boolean, default: false },
});

const iframeRef = ref(null);
const videoPlaying = ref(false);
const vimeoVideoId = computed(() => props.embed?.video_id ?? null);
const thumbnailUrl = computed(() => props.embed?.thumbnail_url ?? null);

function onIframeLoad() {
  iframeRef.value?.contentWindow?.postMessage(
    JSON.stringify({ method: 'addEventListener', value: 'timeupdate' }), '*',
  );
}

function onMessage(event) {
  if (event.source !== iframeRef.value?.contentWindow) return;
  let data;
  try { data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; } catch { return; }
  if (data?.event === 'timeupdate' && !videoPlaying.value) {
    videoPlaying.value = true;
    window.removeEventListener('message', onMessage);
  }
}

onMounted(() => window.addEventListener('message', onMessage));
onUnmounted(() => window.removeEventListener('message', onMessage));
</script>

<template>
  <div class="video-bg">
    <div v-if="embed && vimeoVideoId" class="video-bg__wrap" :style="{ aspectRatio: `${embed.width} / ${embed.height}` }">
      <img
        v-if="thumbnailUrl" :src="thumbnailUrl" :width="embed.thumbnail_width" :height="embed.thumbnail_height"
        alt="" aria-hidden="true" class="video-bg__thumb" :class="{ 'video-bg__thumb--hidden': videoPlaying }"
      />
      <iframe
        ref="iframeRef"
        :src="`//player.vimeo.com/video/${vimeoVideoId}?api=1&background=${canPlay ? '0' : '1'}&muted=${canPlay ? '0' : '1'}&autoplay=${canPlay ? '0' : '1'}&loop=1&title=0&byline=0&portrait=0&controls=${canPlay ? '1' : '0'}`"
        :title="embed.title" frameborder="0" :allow="canPlay ? undefined : 'autoplay'"
        allowfullscreen loading="eager" class="video-bg__player"
        @load="onIframeLoad"
      />
    </div>
  </div>
</template>

<style scoped>
.video-bg { overflow: hidden; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
.video-bg__wrap { width: auto; height: auto; min-width: 100.5%; min-height: 100.5%; position: absolute; }
.video-bg__thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; transition: opacity 0.8s ease-in-out; pointer-events: none; z-index: 1; }
.video-bg__thumb--hidden { opacity: 0; }
.video-bg__player { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
</style>
