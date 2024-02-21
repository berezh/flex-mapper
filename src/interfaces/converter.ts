import { MapFieldType } from "./field";

export interface MapConverter {
  convert: (source: any, destination: any) => void;
}

// export type MapPair<TSource, TDestination> = [(source: TSource) => any, (destination: TDestination) => any];

export type ConvertMethod = (sourceValue: any) => any;
export type ConvertWay = MapFieldType | ConvertMethod;

export type MapPair = [string, string, ConvertWay?];

export interface MapDestinationOptions {
  field: string;
  convert: ConvertWay;
}

export interface MapPairOptions {
  sourceField: string;
  destinationField: string;
  convert?: ConvertWay;
}
