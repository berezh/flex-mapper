import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapPair, MapPairOptions } from "./interfaces/converter";
import { MapFieldOptions } from "./interfaces/field";

interface IConstructor<T> {
  new (...args: any[]): T;

  // Or enforce default constructor
  // new (): T;
}

export function mapClass<T extends IConstructor<T>>(sourceObject: any, destinationClass: IConstructor<T>): T {
  const destination = new destinationClass();
  return destination;
}

function normalizePair(pair?: MapPair | MapPairOptions): MapPair | undefined {
  if (pair) {
    if (Array.isArray(pair)) {
      return pair;
    } else if (typeof pair === "object") {
      return [pair.field, pair.field, pair.type];
    }
  }
  return undefined;
}

export function map<TSource extends object, TDestination extends object>(source: TSource, ...pairs: (MapPair | MapPairOptions)[]): TDestination {
  const destination = {};

  const mapPairs: MapPair[] = pairs.map(x => normalizePair(x));

  Object.keys(source).forEach(sourceKey => {
    let sourceValue = source[sourceKey];
    const pair = mapPairs.find(x => x[0] === sourceKey);
    const destinationKey = pair?.[1] || sourceKey;
    const type = pair?.[2];
    if (typeof type === "string") {
      if (type === "number") {
        sourceValue = numberConverter(sourceValue);
      } else if (type === "string") {
        sourceValue = stringConverter(sourceValue);
      }
    }

    destination[destinationKey] = sourceValue;
  });

  return destination as any;
}
