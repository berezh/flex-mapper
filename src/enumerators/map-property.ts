import "reflect-metadata";
import { MapPropertyOption } from "../interfaces/property";
import { MetadataKeys } from "../constants";
import { MapConvert } from "../interfaces/converter";

function mapProperty(options: MapPropertyOption);
function mapProperty(sourceProperty: string, convert?: MapConvert);
function mapProperty(p1: unknown, p2?: unknown) {
  return function (target: object, propertyKey: string | symbol) {
    let options: MapPropertyOption = {};

    if (typeof p1 === "object") {
      options = p1 as any;
    } else if (typeof p1 === "string") {
      options.source = p1 as any;
    }

    if (typeof p2 === "function") {
      options.source = p1 as any;
    } else if (typeof p2 === "string") {
      options.source = p2;
    }

    Reflect.defineMetadata(MetadataKeys.MapProperty, options, target, propertyKey);

    const container: { [propertyKey: string]: MapPropertyOption } = Reflect.getMetadata(MetadataKeys.MapPropertyDictionary, target) || {};
    container[propertyKey.toString()] = options;
    Reflect.defineMetadata(MetadataKeys.MapPropertyDictionary, container, target);
  };
}

const MapProperty = mapProperty;

export { MapProperty, mapProperty };
