import { map } from "..";

describe("mapSumObjects", () => {
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
});
