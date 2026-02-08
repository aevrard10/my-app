import { device } from "detox";

describe("App launch", () => {
  it("should launch", async () => {
    await device.launchApp({ newInstance: true });
  });
});
