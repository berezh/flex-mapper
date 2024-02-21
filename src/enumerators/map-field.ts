import "reflect-metadata";
import { MapFieldOptions } from "../interfaces/field";

const metadataKey = Symbol("typeMapper:mapField");

function mapField(options?: MapFieldOptions) {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(metadataKey, options, target, propertyKey);
  };
}

const MapField = mapField;

export { MapField as Map, mapField as map };
