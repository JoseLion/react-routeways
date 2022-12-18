import { expect } from "@stackbuilders/assertive-ts";

import * as reactRouteways from "../../src/index";

describe("[Integration] index.test.ts", () => {
  it("re-exports the library exports", () => {
    expect(reactRouteways).toContainAllKeys([
      "Link",
      "NavLink",
      "Route",
      "createNavigatorHook",
      "useNavigation",
      "usePathVars",
      "useQueryParam",
      "useQueryParameters",
      "useRouteParams",
    ]);
  });
});
