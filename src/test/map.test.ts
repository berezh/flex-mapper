import { map } from "..";
import { MapConfig, MapConvertMethod } from "../interfaces";

function testMap<T extends object>(source: T, result: any) {
  testMapConfig(source, undefined, result);
}

function testMapConfig<T extends object>(source: T, config: MapConfig | undefined, result: any) {
  const mapResult = map(source, config);
  expect(mapResult).toEqual(result);
}

describe("map", () => {
  describe("simple", () => {
    it("no config", () => {
      const tebot = {
        id: 1,
        name: "alfa",
      };
      expect(map(tebot)).toEqual(tebot);
    });

    it("elemental empties", () => {
      testMap(null as any, null);
      testMap(undefined as any, undefined);
      testMap(NaN as any, NaN);
    });

    it("elemental values", () => {
      testMap(1 as any, 1);
      testMap("hello" as any, "hello");
      testMap(true as any, true);
    });

    it("properties empties", () => {
      function testPropertyValue(value: any) {
        const tebot = {
          foo: value,
        };
        testMap(tebot, tebot);
      }

      testPropertyValue(null);
      testPropertyValue(undefined);
      testPropertyValue(NaN);
    });
  });

  it("diff fields", () => {
    const tebot = {
      id: 1,
      name: "alfa",
      toggle: true,
    };
    const dest = { id: 1, nickname: "alfa", toggle: true };
    expect(map(tebot, { name: "nickname" })).toEqual(dest);
  });

  it("number type", () => {
    const tebot = {
      id: "123",
    };
    const dest = { id: 123 };
    expect(map(tebot, { id: ["number"] })).toEqual(dest);
  });

  it("string type", () => {
    const source = {
      foo: 123,
    };
    const dest = { foo: "123" };
    expect(map(source, { foo: ["string"] })).toEqual(dest);
  });

  it("converter number", () => {
    const source = {
      foo: 1,
    };
    const dest = { foo: 2 };
    const convert: MapConvertMethod = sourceValue => parseFloat(sourceValue) + 1;
    expect(map(source, { foo: convert })).toEqual(dest);
  });

  it("converter string", () => {
    const source = {
      foo: "first",
    };
    const dest = { foo: "first_second" };
    const convert: MapConvertMethod = sourceValue => `${sourceValue}_second`;
    expect(map(source, { foo: convert })).toEqual(dest);
  });
});
