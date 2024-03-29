import "reflect-metadata";

import { MapConvert } from "../interfaces";
import { mapProperty } from "./map-property";

function mapConvert(convert: MapConvert) {
  return mapProperty({ convert });
}

const MapConvert = mapConvert;

export { MapConvert, mapConvert };
