import { MetadataKeys } from "./constants";
import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapPair, MapDestinationOptions, MapPairOptions, ConvertMethod, ConvertWay } from "./interfaces/converter";
import { MapPropertyType, MapPropertyOptions } from "./interfaces/property";

interface MapPairNormalized extends Pick<MapPairOptions, "sourceProperty" | "destinationProperty"> {
  type?: MapPropertyType;
  method?: ConvertMethod;
}

function initWay(item: MapPairNormalized, way?: ConvertWay) {
  if (typeof way === "string") {
    item.type = way;
  } else if (typeof way === "function") {
    item.method = way;
  }
}

function normalizePair(pair: MapPair | MapDestinationOptions | MapPairOptions): MapPairNormalized {
  if (Array.isArray(pair)) {
    const sourceProp = pair[0];
    const destProp = pair[2] || sourceProp;
    const result: MapPairNormalized = {
      sourceProperty: sourceProp,
      destinationProperty: destProp,
    };

    initWay(result, pair[1]);
    return result;
  } else {
    const keys = Object.keys(pair);
    if (keys.includes("field")) {
      const p = pair as MapDestinationOptions;

      const result: MapPairNormalized = {
        sourceProperty: p.field,
        destinationProperty: p.field,
      };

      initWay(result, pair.convert);
      return result;
    } else {
      const p = pair as MapPairOptions;

      const result: MapPairNormalized = {
        sourceProperty: p.sourceProperty,
        destinationProperty: p.destinationProperty,
      };

      initWay(result, pair.convert);
      return result;
    }
  }
}

export function map<TSource extends object, TDestination extends object>(source: TSource, ...pairs: (MapPair | MapDestinationOptions | MapPairOptions)[]): TDestination {
  const destination = {};

  const mapPairs: MapPairNormalized[] = pairs.map(x => normalizePair(x));

  Object.keys(source).forEach(sourceKey => {
    let sourceValue = source[sourceKey];
    const pair = mapPairs.find(x => x.sourceProperty === sourceKey);
    const destinationKey = pair?.destinationProperty || sourceKey;
    if (pair) {
      const type = pair.type;
      if (type) {
        if (type === "number") {
          sourceValue = numberConverter(sourceValue);
        } else if (type === "string") {
          sourceValue = stringConverter(sourceValue);
        }
      }
      const method = pair.method;
      if (method) {
        sourceValue = method(sourceValue);
      }
    }

    destination[destinationKey] = sourceValue;
  });

  return destination as any;
}

export function mapClass<TSource extends object, TDestination extends object>(
  source: TSource,
  destination: TDestination,
  ...pairs: (MapPair | MapDestinationOptions | MapPairOptions)[]
): TDestination {
  const metadata: { [propertyKey: string]: MapPropertyOptions } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, destination);
  const mapPairs: MapPairOptions[] = [];

  for (const key in metadata) {
    const options = metadata[key];
    mapPairs.push({
      destinationProperty: key,
      sourceProperty: options.source || key,
      convert: options.type || options.convertor,
    });
  }

  const mapDestination = map(source, ...[...mapPairs, ...pairs]);

  for (const key in mapDestination) {
    destination[key] = mapDestination[key];
  }

  return destination;
}
