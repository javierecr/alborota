<script setup lang="ts">
import type {
  GroupField,
  ImageField,
  KeyTextField,
  NumberField,
  RichTextField,
} from "@prismicio/client";

type ProjectTag = { tag: KeyTextField };

type ProjectData = {
  image: ImageField;
  title: KeyTextField;
  description: RichTextField;
  year: NumberField;
  tags: GroupField<ProjectTag>;
};

const props = defineProps<{ project: ProjectData }>();

type MetaItem = { label: string; underline: boolean };

const metaItems = computed<MetaItem[]>(() => {
  const tags = (props.project.tags ?? [])
    .map((t) => t.tag)
    .filter((t): t is string => Boolean(t))
    .map((label) => ({ label, underline: true }));

  if (props.project.year != null) {
    tags.push({ label: String(props.project.year), underline: false });
  }

  return tags;
});
</script>

<template>
  <FeaturedCard>
    <template #image>
      <PrismicImage
        v-if="project.image?.url"
        :field="project.image"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </template>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <p class="font-abc font-bold uppercase text-[0.9375rem] leading-[18px] text-[#383839]">
          {{ project.title }}
        </p>
        <div
          class="font-stevie-book text-[0.84375rem] leading-[22px] text-alborota-black min-h-[44px] [&>*]:line-clamp-2"
        >
          <PrismicRichText :field="project.description" />
        </div>
      </div>

      <div
        v-if="metaItems.length"
        class="flex flex-wrap items-center gap-3 font-stevie uppercase text-[0.675rem] leading-[18.7px] text-alborota-black"
      >
        <template v-for="(item, i) in metaItems" :key="i">
          <span v-if="i > 0" aria-hidden="true">|</span>
          <span :class="item.underline ? 'underline underline-offset-2' : ''">
            {{ item.label }}
          </span>
        </template>
      </div>
    </div>
  </FeaturedCard>
</template>
