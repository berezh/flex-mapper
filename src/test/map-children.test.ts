import { map } from "..";

describe("map children", () => {
  describe("object", () => {
    it("simple", () => {
      const cat = {
        name: "Tom",
        master: {
          name: "Bob",
          years: "20",
        },
      };
      expect(map(cat)).toEqual(cat);
    });

    it("convert number", () => {
      const cat = {
        name: "Tom",
        master: {
          name: "Bob",
          years: "20",
        },
      };
      expect(map(cat, { master: { years: x => parseFloat(x) } })).toEqual({
        name: "Tom",
        master: {
          name: "Bob",
          years: 20,
        },
      });
    });
  });

  describe("array", () => {
    it("of objects", () => {
      interface TeBot {
        name: string;
      }
      const friends: TeBot[] = [
        {
          name: "Riz",
        },
        {
          name: "Mak",
        },
      ];
      const tebot = {
        name: "Tom",
        friends: friends,
      };

      expect(map(tebot)).toMatchObject(tebot);
      expect(
        map(tebot, {
          friends: {
            name: [x => x.toUpperCase()],
          },
        })
      ).toMatchObject({ ...tebot, friends: [{ name: "RIZ" }, { name: "MAK" }] });
    });
  });
});
