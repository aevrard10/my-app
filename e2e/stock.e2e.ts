describe("Stock flow", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      permissions: { notifications: "YES" },
    });
  });

  it("adds stock item", async () => {
    await element(by.id("tab-feed")).tap();
    await element(by.id("feed-add")).tap();

    await element(by.id("add-feed-select-food")).tap();
    await element(by.id("add-feed-search")).typeText("cricket");
    await element(by.id("add-feed-item-cricket")).tap();

    await element(by.id("add-feed-quantity")).typeText("5");
    await device.hideKeyboard();
    await element(by.id("add-feed-scroll")).scrollTo("bottom");
    await element(by.id("add-feed-submit")).tap();

    await waitFor(element(by.id("feed-card-cricket")))
      .toBeVisible()
      .withTimeout(5000);
  });
});
