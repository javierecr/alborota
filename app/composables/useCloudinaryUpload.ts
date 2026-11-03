import { computed, ref } from 'vue';

type CloudinaryUploadResponse = { secure_url: string };

/**
 * Unsigned, browser-direct image uploads to Cloudinary.
 *
 * Formspark does not store files — a submission carrying a file body is
 * rejected with a 400, and it keeps only links. So reference images go to
 * Cloudinary first and the resulting URLs travel in the Formspark payload.
 *
 * Unsigned means no server route and no secret: the cloud name and upload
 * preset are both public by design. Keep the preset restricted (images only,
 * size cap, a dedicated folder) in the Cloudinary console, since anyone can
 * read these values out of the page.
 */
export const useCloudinaryUpload = () => {
  const { cloudinary } = useRuntimeConfig().public;

  const isConfigured = computed(() => !!cloudinary?.cloudName && !!cloudinary?.uploadPreset);
  const uploading = ref(false);

  /** Resolves to one `secure_url` per file, in the order given. Throws if any upload fails. */
  const uploadAll = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    if (!isConfigured.value) throw new Error('Cloudinary is not configured.');

    uploading.value = true;
    try {
      // Parallel is safe here: the drop zone caps the set at a handful of files.
      return await Promise.all(
        files.map(async (file) => {
          const body = new FormData();
          body.append('file', file);
          body.append('upload_preset', cloudinary.uploadPreset);

          const result = await $fetch<CloudinaryUploadResponse>(
            `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`,
            { method: 'POST', body },
          );
          return result.secure_url;
        }),
      );
    } finally {
      uploading.value = false;
    }
  };

  return { uploadAll, uploading, isConfigured };
};
