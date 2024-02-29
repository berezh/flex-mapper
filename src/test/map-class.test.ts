import { mapClass } from "..";
import { mapConvert } from "../enumerators/map-convert";
import { mapProperty } from "../enumerators/map-property";

function testMp<T extends object>(source: any, dest: T, result: T) {
  expect(mapClass(source, dest)).toEqual(result);
}

describe("mapClass", () => {
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

  it("diff properties (as props)", () => {
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
      @mapProperty({ convert: "number" })
      public id: number;

      @mapProperty({ convert: "string" })
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

  it("types: number, string (as props)", () => {
    class DestinationClass {
      @mapConvert("number")
      public id: number;

      @mapConvert("string")
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
      @mapProperty({ convert: value => value + 1 })
      public id: number;

      @mapProperty({ convert: value => value + "_name" })
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

  it("convert (as props)", () => {
    class DestinationClass {
      @mapConvert(value => value + 1)
      public id: number;

      @mapConvert(value => value + "_name")
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
