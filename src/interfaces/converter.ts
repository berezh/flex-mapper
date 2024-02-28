export type MapConvertType = "default" | "string" | "number";

export type MapConvertMethod = (sourceValue: any) => any;

export type MapConvert = MapConvertType | MapConvertMethod;

export interface MapConverter {
  convert: (source: any, destination: any) => void;
}

export type MapPair = [string, MapConvert, string?];

export interface MapDestinationOptions {
  field: string;
  convert: MapConvert;
}

export interface MapPairOptions {
  sourceProperty: string;
  destinationProperty: string;
  convert?: MapConvert;
}
