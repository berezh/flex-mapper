import "reflect-metadata";
import { MapPropertyOptions } from "../interfaces/property";
import { MetadataKeys } from "../constants";
import { MapConvert } from "../interfaces/converter";

function mapProperty(options: MapPropertyOptions);
function mapProperty(way: MapConvert, source?: string);
function mapProperty(p1: unknown, p2?: unknown) {
  return function (target: object, propertyKey: string | symbol) {
    let options: MapPropertyOptions = {};

    if (typeof p1 === "object") {
      options = p1 as any;
    } else if (typeof p1 === "string") {
      options.type = p1 as any;
    } else if (typeof p1 === "function") {
      options.convertor = p1 as any;
    }

    if (typeof p2 === "string") {
      options.source = p2;
    }

    Reflect.defineMetadata(MetadataKeys.MapProperty, options, target, propertyKey);

    const container: { [propertyKey: string]: MapPropertyOptions } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, target) || {};
    container[propertyKey.toString()] = options;
    Reflect.defineMetadata(MetadataKeys.MapPropertyDictionary, container, target);
  };
}

const MapProperty = mapProperty;

export { MapProperty, mapProperty };
