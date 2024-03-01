import { mapClass } from "..";
import { mapProperty } from "../enumerators/map-property";

function testMp<T extends object>(source: any, dest: T, result: T) {
  const mapResult = mapClass(source, dest);
  // console.log("result", mapResult);
  expect(mapResult).toEqual(result);
}

describe("mapClass", () => {
  it("simple", () => {
    class TebotClass {
      @mapProperty({})
      public id: number;

      @mapProperty({})
      public name: string;
    }

    const dest = new TebotClass();
    dest.id = 1;
    dest.name = "foo";
    testMp(
      {
        id: 1,
        name: "foo",
      },
      new TebotClass(),
      dest
    );
  });

  it("convert property", () => {
    class DestinationClass {
      @mapProperty("code")
      public id: number;

      @mapProperty("firstName")
      public name: string;
    }

    const dest = new DestinationClass();
    dest.id = 1;
    dest.name = "foo";
    testMp(
      {
        code: 1,
        firstName: "foo",
      },
      new DestinationClass(),
      dest
    );
  });

  it("types: number, string", () => {
    class DestinationClass {
      @mapProperty(["number"])
      public id: number;

      @mapProperty(["string"])
      public code: string;
    }

    const dest = new DestinationClass();
    dest.id = 1;
    dest.code = "2";
    testMp(
      {
        id: "1",
        code: 2,
      },
      new DestinationClass(),
      dest
    );
  });

  it("convert", () => {
    class DestinationClass {
      @mapProperty(value => value + 1)
      public id: number;

      @mapProperty(value => value + "_name")
      public name: string;
    }

    const dest = new DestinationClass();
    dest.id = 2;
    dest.name = "foo_name";
    testMp(
      {
        id: 1,
        name: "foo",
      },
      new DestinationClass(),
      dest
    );
  });
});
