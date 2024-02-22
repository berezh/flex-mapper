export type MapPropertyType = "string" | "number";

export interface MapPropertyOptions {
  source?: string;
  type?: MapPropertyType;
  convertor?: (source: any) => any;
}
