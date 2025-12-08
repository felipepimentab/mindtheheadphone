export default defineEventHandler(async (_event) => {
  return await AmplifierSchema.find();
});
