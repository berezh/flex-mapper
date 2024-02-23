import { mapClass } from "..";
import { mapProperty } from "../enumerators/map-property";

function testMp<T extends object>(source: any, dest: T, result: T) {
  expect(mapClass(source, dest)).toEqual(result);
}

describe("map.property", () => {
  it("simple", () => {
    class DestinationClass {
      @mapProperty({})
      public id: number;

      @mapProperty({})
      public name: string;
    }

    const dest = new DestinationClass();
    dest.id = 1;
    dest.name = "foo";
    testMp(
      {
        id: 1,
        name: "foo",
      },
      new DestinationClass(),
      dest
    );
  });

  it("diff properties", () => {
    class DestinationClass {
      @mapProperty({ source: "code" })
      public id: number;

      @mapProperty({ source: "firstName" })
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
      @mapProperty({ type: "number" })
      public id: number;

      @mapProperty({ type: "string" })
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
      @mapProperty({ convertor: value => value + 1 })
      public id: number;

      @mapProperty({ convertor: value => value + "_name" })
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
