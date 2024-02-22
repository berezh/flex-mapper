import { map } from "..";
import { ConvertMethod } from "../interfaces/converter";

describe("map", () => {
  it("simple", () => {
    const source = {
      field1: 1,
      field2: "hello",
    };
    expect(map(source)).toEqual(source);
  });
  it("diff fields", () => {
    const source = {
      field1: 1,
      field2: "hello",
      field3: true,
    };
    const dest = { field1: 1, fieldKey2: "hello", field3: true };

    expect(map(source, ["field2", "fieldKey2"])).toEqual(dest);
    expect(map(source, { sourceProperty: "field2", destinationProperty: "fieldKey2" })).toEqual(dest);
  });

  it("number type", () => {
    const source = {
      foo: "123",
    };
    const dest = { foo: 123 };
    expect(map(source, ["foo", "foo", "number"])).toEqual(dest);
    expect(map(source, { field: "foo", convert: "number" })).toEqual(dest);
  });

  it("string type", () => {
    const source = {
      foo: 123,
    };
    const dest = { foo: "123" };
    expect(map(source, ["foo", "foo", "string"])).toEqual(dest);
    expect(map(source, { field: "foo", convert: "string" })).toEqual(dest);
  });

  it("converter number", () => {
    const source = {
      foo: 1,
    };
    const dest = { foo: 2 };
    const convert: ConvertMethod = sourceValue => parseFloat(sourceValue) + 1;
    expect(map(source, ["foo", "foo", convert])).toEqual(dest);
    expect(map(source, { field: "foo", convert })).toEqual(dest);
  });

  it("converter string", () => {
    const source = {
      foo: "first",
    };
    const dest = { foo: "first_second" };
    const convert: ConvertMethod = sourceValue => `${sourceValue}_second`;
    expect(map(source, ["foo", "foo", convert])).toEqual(dest);
    expect(map(source, { field: "foo", convert })).toEqual(dest);
  });
});
