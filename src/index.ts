import { MetadataKeys } from "./constants";
import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapPair, MapDestinationOptions, MapPairOptions, MapConvertMethod, MapConvert, MapConvertType } from "./interfaces/converter";
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

export function map<TSource extends object, TDestination extends object>(source: TSource, ...pairs: (MapPair | MapDestinationOptions | MapPairOptions)[]): TDestination {
  const destination = {};

  const mapPairs: MapPairNormalized[] = pairs.map(x => normalizePair(x));
  const keys = Object.keys(source);

  keys.forEach(sourceKey => {
    let sourceValue = source[sourceKey];
    const pair = mapPairs.find(x => x.source === sourceKey);
    const destinationKey = pair?.destination || sourceKey;
    if (pair) {
      const type = pair.type;
      if (type) {
        if (type === "number") {
          sourceValue = numberConverter(sourceValue);
        } else if (type === "string") {
          sourceValue = stringConverter(sourceValue);
        }
      }
      const method = pair.convert;
      if (method) {
        sourceValue = method(sourceValue);
      }
    }

    if (typeof sourceValue === "object") {
      destination[destinationKey] = map(sourceValue);
    } else {
      destination[destinationKey] = sourceValue;
    }
  });

  return destination as any;
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
