import getSpeciesIcon from "./getSpeciesIcon";

describe("getSpeciesIcon", () => {
  it("returns snake icon", () => {
    expect(getSpeciesIcon("snake")).toBe("snake");
  });

  it("returns lizard icon for lizard/gecko/monitor", () => {
    expect(getSpeciesIcon("lizard")).toBeTruthy();
    expect(getSpeciesIcon("gecko")).toBeTruthy();
    expect(getSpeciesIcon("monitor")).toBeTruthy();
  });

  it("returns turtle icon", () => {
    expect(getSpeciesIcon("turtle")).toBe("turtle");
  });

  it("returns frog icon", () => {
    expect(getSpeciesIcon("amphibian")).toBe("frog");
  });

  it("returns alligator icon", () => {
    expect(getSpeciesIcon("crocodilian")).toBe("alligator");
  });

  it("returns paw icon by default", () => {
    expect(getSpeciesIcon("unknown")).toBe("paw");
  });

  it("returns paw icon when type is undefined", () => {
    expect(getSpeciesIcon()).toBe("paw");
  });
});
