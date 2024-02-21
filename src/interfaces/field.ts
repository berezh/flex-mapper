export type MapFieldType = "string" | "number";

export interface MapFieldOptions {
  name?: string;
  type?: MapFieldType;
  convertor?: (source: any) => any;
}
