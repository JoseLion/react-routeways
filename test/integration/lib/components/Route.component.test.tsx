import { expect } from "@assertive-ts/core";
import { Route as OriginalRoute } from "react-router-dom";

import { Route } from "../../../../src/lib/components/Route.component";

describe("[Integration] Route.component.test.tsx", () => {
  it("is referentially equal to react-router-dom Route component", () => {
    expect(Route).toBeSame(OriginalRoute as typeof Route);
  });
});
