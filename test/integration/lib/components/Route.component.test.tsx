import { expect } from "@assertive-ts/core";
import { Route as OriginalRoute } from "react-router-dom";
import { expectTypeOf, it, suite } from "vitest";

import { Route } from "../../../../src/lib/components/Route.component";

import type { Optional } from "../../../../src/lib/helpers/commons";
import type { Routeway } from "ts-routeways";

suite("[Integration] Route.component.test.tsx", () => {
  it("is referentially equal to react-router-dom Route component", () => {
    expect(Route).toBeSame(OriginalRoute as typeof Route);
  });

  it("defines the proper types", () => {
    expectTypeOf(Route)
      .parameter(0)
      .toHaveProperty("route")
      .toEqualTypeOf<Optional<Routeway | "*">>();
    expectTypeOf(Route)
      .parameter(0)
      .toHaveProperty("catchAll")
      .toEqualTypeOf<Optional<boolean>>();
    expectTypeOf(Route)
      .parameter(0)
      .toHaveProperty("index")
      .toEqualTypeOf<Optional<boolean>>();

    expectTypeOf(Route)
      .parameter(0)
      .not.toHaveProperty("path");
    expectTypeOf(Route)
      .parameter(0)
      .toHaveProperty("route")
      .not.toEqualTypeOf<string>();
  });
});
