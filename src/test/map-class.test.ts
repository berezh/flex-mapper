import { map } from "..";
import { mapProperty } from "../enumerators/map-property";
import { ClassType } from "../interfaces";

function testMp<T extends ClassType<any>>(source: any, dest: T, result: T) {
  const mapResult = map(source, dest);
  // console.log("result", mapResult);
  expect(mapResult).toEqual(result);
}

describe("map class", () => {
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
      TebotClass,
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
      DestinationClass,
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
      DestinationClass,
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
      DestinationClass,
      dest
    );
  });
});
