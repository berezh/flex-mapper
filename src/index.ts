import { MapPair } from "./interfaces/converter";

interface IConstructor<T> {
  new (...args: any[]): T;

  // Or enforce default constructor
  // new (): T;
}

export function mapClass<T extends IConstructor<T>>(sourceObject: any, destinationClass: IConstructor<T>): T {
  const destination = new destinationClass();
  return destination;
}

export function map<TSource extends object, TDestination extends object>(source: TSource, ...pairs: MapPair[]): TDestination {
  const destination = {};

  // pairs.forEach(pair => {
  //   pair[1](destination, pair[0](source));
  // });

  // const sourceKeys = pairs.map(x => x[1]);

  Object.keys(source).forEach(sourceKey => {
    const sourceValue = source[sourceKey];
    const pair = pairs.find(x => x[0] === sourceKey);
    const destinationKey = pair ? pair[1] : sourceKey;

    destination[destinationKey] = sourceValue;
  });

  return destination as any;
}
