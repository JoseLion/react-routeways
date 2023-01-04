import { expectTypeOf } from "expect-type";
import { ReactElement, ReactFragment } from "react";
import { RoutesProps as OriginalRoutesProps } from "react-router-dom";

import { RouteProps } from "../../../../src/lib/components/Route.component";
import { Routes, RoutesProps } from "../../../../src/lib/components/Routes.component";
import { Nullable } from "../../../../src/lib/helpers/commons";

expectTypeOf(Routes).toEqualTypeOf<(props: RoutesProps) => Nullable<ReactElement>>();

expectTypeOf(Routes).parameter(0).toMatchTypeOf<{
  children: ReactElement<RouteProps> | ReactElement<RouteProps>[] | ReactFragment;
}>();

expectTypeOf(Routes).parameter(0).not.toEqualTypeOf<OriginalRoutesProps>();
