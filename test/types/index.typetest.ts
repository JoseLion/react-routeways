import { expectTypeOf } from "expect-type";
import { CodecMap, Routeway } from "ts-routeways";

import {
  type NavigateMethods,
  type NavigateOptions,
  type NavigatorHook,
  type Navigation,
  type UsePathVars,
  type UseQueryParam,
  type UseQueryParameters,
  type UseRouteParams,
  type RouteProps,
  type RoutesProps,
  type LinkProps,
  type NavLinkProps,
} from "../../src/index";

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

