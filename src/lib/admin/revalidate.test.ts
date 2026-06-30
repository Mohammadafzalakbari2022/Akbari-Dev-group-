import test from "node:test";
import assert from "node:assert/strict";
import { getLocaleAwarePaths } from "./revalidate";

test("builds locale-aware paths for public routes", () => {
  assert.deepEqual(getLocaleAwarePaths("/about", ["en", "fa", "ps"] as const), [
    "/about",
    "/en/about",
    "/fa/about",
    "/ps/about",
  ]);

  assert.deepEqual(getLocaleAwarePaths("/", ["en", "fa", "ps"] as const), [
    "/",
    "/en",
    "/fa",
    "/ps",
  ]);
});
