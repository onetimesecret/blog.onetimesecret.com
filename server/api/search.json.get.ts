export default eventHandler(async () => {
  const posts = await queryCollection('posts').all();
  return posts;
});
