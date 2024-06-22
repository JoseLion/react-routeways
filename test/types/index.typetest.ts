import { expectTypeOf } from "expect-type";

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
