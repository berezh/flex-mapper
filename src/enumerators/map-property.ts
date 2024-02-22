import "reflect-metadata";
import { MapPropertyOptions } from "../interfaces/property";
import { MetadataKeys } from "../constants";

function mapProperty(options: MapPropertyOptions) {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(MetadataKeys.MapProperty, options, target, propertyKey);

    const container: { [propertyKey: string]: MapPropertyOptions } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, target) || {};
    container[propertyKey.toString()] = options;
    Reflect.defineMetadata(MetadataKeys.MapPropertyDictionary, container, target);
  };
}

const MapProperty = mapProperty;

export { MapProperty, mapProperty };
