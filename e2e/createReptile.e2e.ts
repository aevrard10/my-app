describe("Reptiles flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      permissions: { notifications: "YES" },
    });
  });

  it("creates a reptile", async () => {
    await element(by.id("tab-reptiles")).tap();
    await element(by.id("reptiles-add")).tap();

    await element(by.id("add-reptile-name")).typeText("Testy");
    await element(by.id("add-reptile-species")).typeText("Python regius");

    await device.hideKeyboard();
    await element(by.id("add-reptile-scroll")).scrollTo("bottom");
    await element(by.id("add-reptile-submit")).tap();

    await waitFor(element(by.text("Testy")))
      .toBeVisible()
      .withTimeout(5000);
  });
});
