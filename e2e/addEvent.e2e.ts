describe("Agenda flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      permissions: { notifications: "YES" },
    });
  });

  it("adds an event", async () => {
    await element(by.id("home-quick-add-event")).tap();

    await element(by.id("add-event-title")).typeText("Test Event");
    await device.hideKeyboard();

    await element(by.id("add-event-scroll")).scrollTo("bottom");
    await element(by.id("add-event-submit")).tap();

    await element(by.id("tab-agenda")).tap();

    await waitFor(element(by.text("Test Event")))
      .toBeVisible()
      .withTimeout(5000);
  });
});
