import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "./page";

// 各テスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
});

test("Page", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
