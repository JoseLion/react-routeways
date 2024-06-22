import { expectTypeOf } from "expect-type";

import { Routes, type RoutesProps } from "../../../../src/lib/components/Routes.component";

import type { RouteProps } from "../../../../src/lib/components/Route.component";
import type { Nullable } from "../../../../src/lib/helpers/commons";
import type { ReactElement, ReactNode } from "react";
import type { RoutesProps as OriginalRoutesProps } from "react-router-dom";

expectTypeOf(Routes).toEqualTypeOf<(props: RoutesProps) => Nullable<ReactElement>>();

expectTypeOf(Routes).parameter(0).toMatchTypeOf<{
  children: ReactElement<RouteProps> | ReactElement<RouteProps>[] | ReactNode;
}>();

expectTypeOf(Routes).parameter(0).not.toEqualTypeOf<OriginalRoutesProps>();
