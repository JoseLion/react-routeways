import { expect } from "@assertive-ts/core";
import { expectTypeOf, it, suite } from "vitest";

// eslint-disable-next-line import/no-namespace
import * as reactRouteways from "../../src/main";

import type {
  LinkProps,
  NavLinkProps,
  NavigateMethods,
  NavigateOptions,
  Navigation,
  NavigatorHook,
  RouteProps,
  RoutesProps,
  UsePathVars,
  UseQueryParam,
  UseQueryParameters,
  UseRouteParams,
} from "../../src/main";
import type { CodecMap, Routeway } from "ts-routeways";

suite("[Integration] index.test.ts", () => {
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

  it("defines the proper types", () => {
    expectTypeOf<NavigateMethods<CodecMap, CodecMap>>().not.toBeAny();
    expectTypeOf<NavigateOptions<unknown>>().not.toBeAny();
    expectTypeOf<NavigatorHook<Record<string, Routeway>>>().not.toBeAny();
    expectTypeOf<Navigation>().not.toBeAny();
    expectTypeOf<UsePathVars<Record<string, unknown>>>().not.toBeAny();
    expectTypeOf<UseQueryParam<unknown>>().not.toBeAny();
    expectTypeOf<UseQueryParameters<Record<string, unknown>>>().not.toBeAny();
    expectTypeOf<UseRouteParams<Record<string, unknown>>>().not.toBeAny();
    expectTypeOf<RouteProps>().not.toBeAny();
    expectTypeOf<RoutesProps>().not.toBeAny();
    expectTypeOf<LinkProps<Routeway>>().not.toBeAny();
    expectTypeOf<NavLinkProps<Routeway>>().not.toBeAny();
  });
});
