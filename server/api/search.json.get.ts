import { queryCollection } from '@nuxt/content/nitro';

// Server-side queries take the H3 event as their first argument; the bare
// `queryCollection('posts')` form is the app-side signature and crashes here.
export default eventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts').where('draft', '<>', true).all();
  return posts;
});
