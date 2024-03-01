import "reflect-metadata";
import { MetadataKeys } from "../constants";
import { DestinationInfo, MapConfig, MapConvert, MapPropertyConfig } from "../interfaces";

export function parseDestinationConfig(property: string, config: MapPropertyConfig): DestinationInfo {
  const details: DestinationInfo = { destination: property };

  if (Array.isArray(config)) {
    details.convert = config[0];
    details.source = config[1];
  } else if (typeof config === "string") {
    details.source = config;
  } else if (typeof config === "function") {
    details.convert = config;
  } else if (typeof config === "object") {
    details.children = parseConfig(config as MapConfig);
  }

  if (!details.source) {
    details.source = details.destination;
  }

  return details;
}

function parseConfig(config: MapConfig): DestinationInfo[] {
  return Object.keys(config).map(key => parseDestinationConfig(key, config[key]));
}

function mapProperty(config: MapPropertyConfig);
function mapProperty(sourceProperty: string, convert?: MapConvert);
function mapProperty(p1: unknown, p2?: MapConvert) {
  return function (target: object, propertyKey: string | symbol) {
    const sourceConfig: MapPropertyConfig = typeof p1 === "string" && p2 ? [p2, p1] : (p1 as MapPropertyConfig);
    const destinationInfo = parseDestinationConfig(propertyKey.toString(), sourceConfig);

    Reflect.defineMetadata(MetadataKeys.MapProperty, destinationInfo, target, propertyKey);
    const container: { [propertyKey: string]: DestinationInfo } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, target) || {};
    container[propertyKey.toString()] = destinationInfo;
    Reflect.defineMetadata(MetadataKeys.MapPropertyDictionary, container, target);
  };
}

const MapProperty = mapProperty;

export { MapProperty, mapProperty };
