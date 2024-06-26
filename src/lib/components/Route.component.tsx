import { Route as OriginalRoute, type RouteProps as OriginalRouteProps } from "react-router-dom";

import type { Nullable } from "../helpers/commons";
import type { ReactElement, ReactNode } from "react";
import type { Routeway } from "ts-routeways";

export interface RouteProps extends Omit<OriginalRouteProps, "path"> {
  /**
   * Enables the "catchall" splat for the route. This means that a `/*` string
   * will be appended to the end othe the path when the template is generated
   * from the `Routeway` route.
   *
   * @default false
   */
  catchAll?: boolean;
  /**
   * Optional nested react-routeways `Route` component(s). It also supports
   * React `Fragment` components(s) as react-router-dom's `Route` does.
   */
  children?:
    | ReactElement<RouteProps>[]
    | ReactElement<RouteProps>
    | ReactNode;
  /**
   * The `Routeway` route to take the template to set to the `path` prop
   * of react-router-dom's `Route` component.
   *
   * The splat `*` character is also a supported value. To append a splat `*`
   * to a route you can set the {@link catchAll} prop to `true`.
   */
  route?: Routeway | "*";
}

/**
 * Same as react-router-dom's `<Route>` component, but it replaces the `path`
 * prop with `route`, where you can pass as `Routeway` route which will be used
 * to create the path.
 */
export const Route = OriginalRoute as (props: RouteProps) => Nullable<ReactElement>;
