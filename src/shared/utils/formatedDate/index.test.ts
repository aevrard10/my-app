import {
  formatDDMMYYYY,
  formatYYYYMMDD,
  formatTime,
  formatDateToYYYYMMDD,
  formatLongDateToYYYYMMDD,
} from "./index";

describe("formatedDate", () => {
  it("formats YYYY-MM-DD to DD/MM/YYYY", () => {
    expect(formatDDMMYYYY("2026-02-06")).toBe("06/02/2026");
  });

  it("formats DD/MM/YYYY to YYYY-MM-DD", () => {
    expect(formatYYYYMMDD("06/02/2026")).toBe("2026-02-06");
  });

  it("formats time parts", () => {
    expect(formatTime({ hours: 9, minutes: 5 })).toBe("09:05");
    expect(formatTime({ hours: 9, minutes: 5, seconds: 7 })).toBe("09:05:07");
  });

  it("normalizes date strings", () => {
    expect(formatDateToYYYYMMDD("06/02/2026")).toBe("2026-02-06");
    expect(formatDateToYYYYMMDD("2026-02-06")).toBe("2026-02-06");
  });

  it("parses long french dates", () => {
    expect(formatLongDateToYYYYMMDD("samedi 15 février 2025")).toBe(
      "2025-02-15",
    );
  });
});
