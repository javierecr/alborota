<script setup lang="ts">
import type { Content } from "@prismicio/client";

const props = defineProps(
  getSliceComponentProps<Content.FeaturedProjectsSlice>(),
);

/** Resolved data of each linked `project` document (skips broken/unpublished links). */
const projects = computed(() =>
  (props.slice.primary.projects ?? [])
    .map((item) => item.project)
    .filter(
      (p): p is Extract<typeof p, { data: unknown }> =>
        Boolean(p) && "data" in p && Boolean(p.data),
    )
    .map((p) => p.data),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container mx-auto px-6 py-28 flex flex-col items-center gap-12">
      <FeaturedSectionHeader :heading="slice.primary.heading" :cta="slice.primary.cta" />

      <FeaturedCardRow v-if="projects.length" gap="gap-[18px]">
        <FeaturedProjectCard
          v-for="(project, i) in projects"
          :key="i"
          :project="project"
        />
      </FeaturedCardRow>
    </div>
  </section>
</template>
