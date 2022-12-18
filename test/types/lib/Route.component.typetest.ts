/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectTypeOf } from "expect-type";
import { Routeway } from "ts-routeways";

import { Route } from "../../../src/lib/Route.component";

expectTypeOf(Route).parameter(0)
  .toHaveProperty("route")
  .not.toHaveProperty("path");

expectTypeOf(Route).parameter(0).toMatchTypeOf<{ route?: Routeway; }>();

// @ts-expect-error
expectTypeOf(Route).parameter(0).toMatchTypeOf<{ path?: string; }>();
