import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapPair, MapDestinationOptions, MapPairOptions, ConvertMethod } from "./interfaces/converter";
import { MapFieldType } from "./interfaces/field";

interface MapPairNormalized extends Pick<MapPairOptions, "sourceField" | "destinationField"> {
  type?: MapFieldType;
  method?: ConvertMethod;
}

interface IConstructor<T> {
  new (...args: any[]): T;

  // Or enforce default constructor
  // new (): T;
}

export function mapClass<T extends IConstructor<T>>(sourceObject: any, destinationClass: IConstructor<T>): T {
  const destination = new destinationClass();
  return destination;
}

function normalizePair(pair: MapPair | MapDestinationOptions): MapPairNormalized {
  if (Array.isArray(pair)) {
    const result: MapPairNormalized = {
      sourceField: pair[0],
      destinationField: pair[1],
    };

    const way = pair?.[2];
    if (typeof way === "string") {
      result.type = way;
    } else if (typeof way === "function") {
      result.method = way;
    }

    return result;
  } else {
    const result: MapPairNormalized = {
      sourceField: pair.field,
      destinationField: pair.field,
    };

    const way = pair.convert;
    if (typeof way === "string") {
      result.type = way;
    } else if (typeof way === "function") {
      result.method = way;
    }
    return result;
  }
}

export function map<TSource extends object, TDestination extends object>(source: TSource, ...pairs: (MapPair | MapDestinationOptions)[]): TDestination {
  const destination = {};

  const mapPairs: MapPairNormalized[] = pairs.map(x => normalizePair(x));

  Object.keys(source).forEach(sourceKey => {
    let sourceValue = source[sourceKey];
    const pair = mapPairs.find(x => x.sourceField === sourceKey);
    const destinationKey = pair?.destinationField || sourceKey;
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
