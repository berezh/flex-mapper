import { MetadataKeys } from "./constants";
import { numberConverter } from "./converters/number";
import { stringConverter } from "./converters/string";
import { MapConvertType, MapConfig, MapPropertyConfig, DestinationInfo } from "./interfaces";

function parseSourceConfig(property: string, config: MapPropertyConfig): DestinationInfo {
  const details: DestinationInfo = {
    source: property,
  };

  if (Array.isArray(config)) {
    details.convert = config[0];
    details.destination = config[1];
  } else if (typeof config === "string") {
    details.destination = config;
  } else if (typeof config === "function") {
    details.convert = config;
  } else if (typeof config === "object") {
    details.children = parseConfig(config as MapConfig);
  }

  return details;
}

function parseConfig(config: MapConfig): DestinationInfo[] {
  return Object.keys(config).map(key => parseSourceConfig(key, config[key]));
}

function convertDestinationValue(sourceValue: unknown, destinationInfo?: DestinationInfo): unknown {
  let destinationValue = sourceValue;
  if (destinationInfo) {
    const convert = destinationInfo.convert;
    if (typeof convert === "string") {
      const type = convert as MapConvertType;
      if (type === "number") {
        destinationValue = numberConverter(destinationValue);
      } else if (type === "string") {
        destinationValue = stringConverter(destinationValue);
      }
    } else if (typeof convert === "function") {
      destinationValue = convert(destinationValue);
    }
  }

  return destinationValue;
}

function convertDestinationObject<TDestination extends object>(
  source: object,
  destination: TDestination,
  destinationInfos: DestinationInfo[],
  convertChild: (name: string, value: object, infos: DestinationInfo[]) => object
): TDestination {
  const keys = Object.keys(source);

  keys.forEach(sourceKey => {
    const destInfo = destinationInfos.find(x => x.source === sourceKey);
    const destValue = convertDestinationValue(source[sourceKey], destInfo);
    const destinationKey = destInfo?.destination || sourceKey;

    if (typeof destValue === "object") {
      destination[destinationKey] = convertChild(destinationKey, destValue as object, destInfo?.children || []);
    } else {
      destination[destinationKey] = destValue;
    }
  });

  return destination;
}

function innerMap<TSource extends object, TDestination extends object>(source: TSource, destinationInfos: DestinationInfo[]): TDestination {
  const destinationObject = {};
  return convertDestinationObject(source, destinationObject, destinationInfos, (n, v, dis) => innerMap(v, dis)) as any;
}

export function map<TSource extends object, TDestination extends object>(source: TSource, config?: MapConfig): TDestination {
  const configInfos: DestinationInfo[] = parseConfig(config || {});
  return innerMap(source, configInfos);
}

function getMetaDestinationInfos(destination: object): DestinationInfo[] {
  const metadata: { [propertyKey: string]: DestinationInfo } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, destination);
  return Object.keys(metadata).map(key => metadata[key]);
}

function innerMapClass<TSource extends object, TDestination extends object>(source: TSource, destination: TDestination, configInfos: DestinationInfo[]): TDestination {
  const metaInfos = getMetaDestinationInfos(destination);
  const configSourceKeys = configInfos.map(x => x.source);
  const destinationInfos = [...configInfos, ...metaInfos.filter(x => !configSourceKeys.includes(x.source))];

  return convertDestinationObject(source, destination, destinationInfos, (n, v, dis) => innerMapClass(v, destination[n], dis));
}

export function mapClass<TSource extends object, TDestination extends object>(source: TSource, destination: TDestination, config?: MapConfig): TDestination {
  const configInfos: DestinationInfo[] = parseConfig(config || {});
  return innerMapClass(source, destination, configInfos);
}
