import { expect } from "@assertive-ts/core";

// eslint-disable-next-line import/no-namespace
import * as reactRouteways from "../../src/index";

describe("[Integration] index.test.ts", () => {
  it("re-exports the library exports", () => {
    expect(reactRouteways).toContainAllKeys(
      "Link",
      "NavLink",
      "Route",
      "createNavigatorHook",
      "useNavigation",
      "usePathVars",
      "useQueryParam",
      "useQueryParameters",
      "useRouteParams",
    );
  });
});
