/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectTypeOf } from "expect-type";
import { Routeway } from "ts-routeways";

import { Route } from "../../../../src/lib/components/Route.component";
import { Optional } from "../../../../src/lib/helpers/commons";

expectTypeOf(Route)
  .parameter(0)
  .toHaveProperty("route")
  .toEqualTypeOf<Routeway | "*">;
expectTypeOf(Route)
  .parameter(0)
  .toHaveProperty("catchAll")
  .toEqualTypeOf<Optional<boolean>>();

expectTypeOf(Route)
  .parameter(0)
  .not.toHaveProperty("path");
expectTypeOf(Route)
  .parameter(0)
  .toHaveProperty("route")
  .not.toEqualTypeOf<string>();