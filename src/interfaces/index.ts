export type MapConvertType = "string" | "number";

export type MapConvertMethod = (sourceValue: any) => any;

export type MapConvert = MapConvertType | MapConvertMethod;

export interface MapConverter {
  convert: (source: any, destination: any) => void;
}

export type MapPropertyConfig = MapConfig | string | MapConvertMethod | [MapConvert, string?];

export interface MapConfig {
  [source: string]: MapPropertyConfig;
}

export interface DestinationInfo {
  source?: string;
  destination?: string;
  convert?: MapConvert;
  children?: DestinationInfo[];
}
