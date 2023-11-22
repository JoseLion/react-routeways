import { Children, Fragment, isValidElement, ReactElement, ReactNode } from "react";
import {
  IndexRouteObject,
  LazyRouteFunction,
  NonIndexRouteObject,
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
    | ReactNode;
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
          const { children, catchAll = false, route, index, lazy, ...rest } = child.props as RouteProps;
          const splat = catchAll ? "/*" : "";
          const path = route === "*" ? route : route?.template().concat(splat);
          const lazyIndex = lazy as LazyRouteFunction<IndexRouteObject>;
          const lazyNonIndex = lazy as LazyRouteFunction<NonIndexRouteObject>;

          if (index === true) {
            return <OriginalRoute {...rest} index={true} lazy={lazyIndex} />;
          }

          if (children === undefined) {
            return (
              <OriginalRoute
                key={path}
                {...rest}
                index={index}
                path={path}
                lazy={lazyNonIndex}
              />
            );
          }

          return (
            <OriginalRoute key={path} {...rest} index={index} path={path} lazy={lazyNonIndex}>
              {makePatchedChildren(children)}
            </OriginalRoute>
          );
        }

        if (child.type === Fragment) {
          return makePatchedChildren((child.props as RoutesProps).children);
        }
      }

      return child as ReactElement<RouteProps>;
  });
}
