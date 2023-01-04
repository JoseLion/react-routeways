import { Children, Fragment, isValidElement, ReactElement, ReactFragment } from "react";
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
 * A "wrapper" over react-router-dom's `<Routes>` component which allows the use
 * of react-routeways' {@link Route} components as children.
 */
export const Routes = new Proxy(OriginalRoutes, {
  apply(target, thisArg, argArray) {
    const propsArg = argArray.at(0) as RoutesProps;
    const children = makePatchedChildren(propsArg.children);

    return Reflect.apply(target, thisArg, [{ ...propsArg, children }]) as Nullable<ReactElement>;
  },
}) as (props: RoutesProps) => Nullable<ReactElement>;

function makePatchedChildren(propsChildren: RoutesProps["children"]): ReactElement<RouteProps>[] {
  return Children.toArray(propsChildren).flatMap(child => {
    if (isValidElement(child)) {
      const isRouteChild = typeof child === "object"
          && child !== null
          && "type" in child
          && child.type === Route
          && "route" in child.props;

        if (isRouteChild) {
          const { children, catchAll = false, route, index, ...rest } = child.props as RouteProps;
          const splat = catchAll ? "/*" : "";
          const path = route === "*" ? route : route?.template().concat(splat);

          if (index === true) {
            return <OriginalRoute {...rest} index={true} />;
          }

          return children !== undefined
            ? (
              <OriginalRoute {...rest} index={index} path={path}>
                {makePatchedChildren(children)}
              </OriginalRoute>
            )
            : <OriginalRoute {...rest} index={index} path={path} />;
        }

        if (child.type === Fragment) {
          return makePatchedChildren((child.props as RoutesProps).children);
        }
      }

      return child as ReactElement<RouteProps>;
  });
}
