function getName(name: string) {
  return Symbol(`typeMapper:${name}`);
}

export const MetadataKeys = {
  MapProperty: getName("MapProperty"),
  MapPropertyDictionary: getName("MapPropertyDictionary"),
};
