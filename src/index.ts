import { MetadataKeys } from "./constants";
import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapPair, MapDestinationOptions, MapPairOptions, MapConvertMethod, MapConvert, MapConvertType, MapConfig } from "./interfaces/converter";
import { MapPropertyOption } from "./interfaces/property";

interface MapPairNormalized extends Pick<MapPairOptions, "sourceProperty" | "destinationProperty"> {
  type?: MapConvertType;
  convert?: MapConvertMethod;
}

function initWay(item: MapPairNormalized, way?: MapConvert) {
  if (typeof way === "string") {
    item.type = way;
  } else if (typeof way === "function") {
    item.convert = way;
  }
}

function normalizePair(pair: MapPair | MapDestinationOptions | MapPairOptions): MapPairNormalized {
  if (Array.isArray(pair)) {
    const sourceProp = pair[0];
    const destProp = pair[2] || sourceProp;
    const result: MapPairNormalized = {
      source: sourceProp,
      destination: destProp,
    };

    initWay(result, pair[1]);
    return result;
  } else {
    const keys = Object.keys(pair);
    if (keys.includes("field")) {
      const p = pair as MapDestinationOptions;

      const result: MapPairNormalized = {
        source: p.destination,
        destination: p.destination,
      };

      initWay(result, pair.convert);
      return result;
    } else {
      const p = pair as MapPairOptions;

      const result: MapPairNormalized = {
        source: p.source,
        destination: p.destination,
      };

      initWay(result, pair.convert);
      return result;
    }
  }
}

interface DestinationInfo {
  source: string;
  destination?: string;
  convert?: MapConvert;
  children?: DestinationInfo[];
}

function parseConfig(config: MapConfig): DestinationInfo[] {
  const result: DestinationInfo[] = [];
  const keys = Object.keys(config);

  keys.forEach(key => {
    const value = config[key];
    const details: DestinationInfo = { source: key };

    if (Array.isArray(value)) {
      details.convert = value[0];
      details.destination = value[1];
    } else if (typeof value === "string") {
      details.destination = value;
    } else if (typeof value === "function") {
      details.convert = value;
    } else if (typeof value === "object") {
      details.children = parseConfig(value as MapConfig);
    }

    result.push(details);
  });

  return result;
}

function innerMap<TSource extends object, TDestination extends object>(source: TSource, destinationInfos: DestinationInfo[]): TDestination {
  const destination = {};

  const keys = Object.keys(source);

  keys.forEach(sourceKey => {
    let sourceValue = source[sourceKey];
    const destInfo = destinationInfos.find(x => x.source === sourceKey);
    const destinationKey = destInfo?.destination || sourceKey;
    if (destInfo) {
      const convert = destInfo.convert;
      if (typeof convert === "string") {
        const type = convert as MapConvertType;
        if (type === "number") {
          sourceValue = numberConverter(sourceValue);
        } else if (type === "string") {
          sourceValue = stringConverter(sourceValue);
        }
      } else if (typeof convert === "function") {
        sourceValue = convert(sourceValue);
      }
    }

    if (typeof sourceValue === "object") {
      destination[destinationKey] = innerMap(sourceValue, destInfo?.children || []);
    } else {
      destination[destinationKey] = sourceValue;
    }
  });

  return destination as any;
}

export function map<TSource extends object, TDestination extends object>(source: TSource, config?: MapConfig): TDestination {
  const sourceInfos: DestinationInfo[] = parseConfig(config || {});
  return innerMap(source, sourceInfos);
}

export function mapClass<TSource extends object, TDestination extends object>(
  source: TSource,
  destination: TDestination,
  ...pairs: (MapPair | MapDestinationOptions | MapPairOptions)[]
): TDestination {
  const metadata: { [propertyKey: string]: MapPropertyOption } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, destination);
  const mapPairs: MapPairOptions[] = [];

  for (const key in metadata) {
    const options = metadata[key];
    mapPairs.push({
      destination: key,
      source: options.source || key,
      convert: options.convert,
    });
  }

  const mapDestination = map(source, ...[...mapPairs, ...pairs]);

  for (const key in mapDestination) {
    destination[key] = mapDestination[key];
  }

  return destination;
}
