import { expectTypeOf } from "expect-type";

import { Route } from "../../../../src/lib/components/Route.component";

import type { Optional } from "../../../../src/lib/helpers/commons";
import type { Routeway } from "ts-routeways";

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
