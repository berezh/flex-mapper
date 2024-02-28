import { MapConvertType } from "./converter";

export interface MapPropertyOptions {
  source?: string;
  type?: MapConvertType;
  convertor?: (source: any) => any;
}
