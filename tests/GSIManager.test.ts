import { GSIManager } from "../src/core/GSIManager";

describe("GSIManager", () => {
  it("should initialize with default port", () => {
    const manager = new GSIManager();
    expect(manager).toBeDefined();
  });

  it("should allow setting custom port", () => {
    const manager = new GSIManager(4000);
    expect(manager).toBeDefined();
  });
});
