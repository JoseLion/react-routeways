import { Children, ReactElement, ReactFragment } from "react";
import {
  Route as OriginalRoute,
  Routes as OriginalRoutes,
  RoutesProps as OriginalRoutesProps,
} from "react-router-dom";

import { Nullable } from "../helpers/commons";

import { Route, RouteProps } from "./Route.component";

export interface RoutesProps extends OriginalRoutesProps {
  /**
   * The children of `<Routes>`, which must be either {@link Route}
   * component(s) or React Feragment(s)
   */
  children:
    | ReactElement<RouteProps>[]
    | ReactElement<RouteProps>
    | ReactFragment[]
    | ReactFragment;
}

/**
 * A "wrapper" over react-router-dom's `Routes` component which allows the use
 * of react-routeways' {@link Route} components as children.
 */
export const Routes = new Proxy(OriginalRoutes, {
  apply(target, thisArg, argArray) {
    const propsArg = argArray.at(0) as RoutesProps;
    const children = Children.map(propsArg.children, child => {
      const isRouteChild = typeof child === "object"
        && child !== null
        && "type" in child
        && child.type === Route
        && "route" in child.props;

      if (isRouteChild) {
        const { route, ...rest } = child.props as RouteProps;
        return <OriginalRoute {...rest} path={route?.template()} />;
      }

      return child;
    });

    return Reflect.apply(target, thisArg, [{ ...propsArg, children }]) as Nullable<ReactElement>;
  },
}) as (props: RoutesProps) => Nullable<ReactElement>;
