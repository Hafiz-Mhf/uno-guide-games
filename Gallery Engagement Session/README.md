# Static Activity Gallery

The guest gallery reads its curated media list from `../gallery-data.js`.

## Add a photo or video

1. Copy the optimized media file into this folder.
2. Add one matching entry to `GALLERY_ITEMS` in `../gallery-data.js`.
3. Supply English and Bahasa Melayu titles and captions.
4. Use `type: 'image'` for JPEG, PNG, AVIF, or WebP files. Use `type: 'video'` for MP4 files.
5. Set `featured: true` only for photos that should appear in the compact guest preview.
6. Run `npm test` before deployment.

Keep images below 500 KB where practical. Keep short videos compressed and avoid autoplay. The page lazy-loads full-gallery images and requests video metadata only until a guest opens a clip.
