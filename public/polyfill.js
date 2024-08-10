if (!Object.hasOwn) {
  Object.hasOwn = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
  console.log("polyfill");
}
