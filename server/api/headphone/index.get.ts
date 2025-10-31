export default defineCachedEventHandler(async (_event) => {
  return await HeadphoneSchema.find();
}, { maxAge: 60 * 60 * 24 }); // 1 day
