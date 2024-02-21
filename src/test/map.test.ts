import { map } from "..";

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
    const d = map(source, ["field2", "fieldKey2"]);
    expect(d).toEqual({ field1: 1, fieldKey2: "hello", field3: true });
  });

  it("number type", () => {
    const source = {
      foo: "123",
    };
    expect(map(source, ["foo", "foo", "number"])).toEqual({ foo: 123 });
    expect(map(source, { field: "foo", type: "number" })).toEqual({ foo: 123 });
  });

  it("string type", () => {
    const source = {
      foo: 123,
    };
    expect(map(source, ["foo", "foo", "string"])).toEqual({ foo: "123" });
    expect(map(source, { field: "foo", type: "string" })).toEqual({ foo: "123" });
  });
});
