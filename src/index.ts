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

function convertProperty(name: string, value: unknown, destinationInfo: DestinationInfo | undefined, convertChild: ConvertChildObject): unknown {
  let destinationValue = value;
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

  if (Array.isArray(destinationValue)) {
    destinationValue = destinationValue.map(x => convertProperty("", x, destinationInfo, convertChild));
  } else if (typeof destinationValue === "object") {
    destinationValue = convertChild(name, destinationValue as object, destinationInfo?.children || []);
  }

  return destinationValue;
}

type ConvertChildObject = (name: string, value: object, infos: DestinationInfo[]) => object;

function convertObject<TDestination extends object>(
  source: object,
  destination: TDestination,
  destinationInfos: DestinationInfo[] | undefined,
  convertChild: ConvertChildObject
): TDestination {
  const keys = Object.keys(source);

  keys.forEach(sourceKey => {
    const destInfo = (destinationInfos || []).find(x => x.source === sourceKey);
    const destValue = convertProperty(sourceKey, source[sourceKey], destInfo, convertChild);
    const destinationKey = destInfo?.destination || sourceKey;
    destination[destinationKey] = destValue;
  });

  return destination;
}

function innerMap<TSource extends object, TDestination extends object>(source: TSource, destinationInfos?: DestinationInfo[]): TDestination {
  const destinationObject = {};
  return convertObject(source, destinationObject, destinationInfos, (n, v, dis) => innerMap(v, dis)) as any;
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

  return convertObject(source, destination, destinationInfos, (n, v, dis) => innerMapClass(v, destination[n], dis));
}

export function mapClass<TSource extends object, TDestination extends object>(source: TSource, destination: TDestination, config?: MapConfig): TDestination {
  const configInfos: DestinationInfo[] = parseConfig(config || {});
  return innerMapClass(source, destination, configInfos);
}
