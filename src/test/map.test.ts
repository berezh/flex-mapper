import { map } from "..";
import { MapConvertMethod } from "../interfaces/converter";

describe("map", () => {
  it("simple", () => {
    const tebot = {
      id: 1,
      name: "alfa",
    };
    expect(map(tebot)).toEqual(tebot);
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
