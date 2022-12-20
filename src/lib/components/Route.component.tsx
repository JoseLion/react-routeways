import { ReactElement } from "react";
import { PathRouteProps, Route as OriginalRoute } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { Nullable } from "../helpers/commons";

export interface RouteProps extends Omit<PathRouteProps, "path"> {
  /**
   * Enables the "catchall" splat for the route. This means that a `/*` string
   * will be appended to the end othe the path when the template is generated
   * from the {@link Routeway} route.
   *
   * @default false
   */
  catchAll?: boolean;
  /**
   * The {@link Routeway} route to take the template to set to the `path` prop
   * of react-router-dom's `Route` component.
   *
   * The splat `*` character is also a supported value.
   */
  route?: Routeway | "*";
}

/**
 * Same as react-router-dom's `<Route>` component, but it replaces the `path`
 * prop with `route`, where you can pass as {@link Routeway} route which will
 * be used to create the path.
 */
export const Route = OriginalRoute as (props: RouteProps) => Nullable<ReactElement>;
