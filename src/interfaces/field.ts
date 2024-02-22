export type MapFieldType = "string" | "number";

export interface MapPropertyOptions {
  source?: string;
  type?: MapFieldType;
  convertor?: (source: any) => any;
}
