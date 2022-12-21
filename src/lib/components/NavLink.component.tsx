import { ReactElement, useMemo } from "react";
import { CodecMap, PathLike, Routeway } from "ts-routeways";
import { NavLink as OriginalNavLink, NavLinkProps as OriginalNavLinkProps } from "react-router-dom";

export interface BaseNavLinkProps<T extends Routeway> {
  /**
   * The `Routeway` route to navigate to.
   */
  to: T;
}

export type ParamNavLinkProps<T extends Routeway> =
  T extends Routeway<PathLike, infer V, CodecMap>
    ? keyof V extends never
      ? {
        /**
         * Optional query parameters to use when the path is generated.
         */
        params?: Parameters<T["makeUrl"]>[0];
      }
      : {
        /**
         * The path variables and optional query parameters to use when the
         * path is generated
         */
        params: Parameters<T["makeUrl"]>[0];
      }
    : never;

export type NavLinkProps<T extends Routeway> =
  & BaseNavLinkProps<T>
  & ParamNavLinkProps<T>
  & Omit<OriginalNavLinkProps, "to">;

/**
 * A wrapper over react-router-dom's `<NavLink>` component, with the difference
 * that the `to` prop expects a `Routeway` route instead of a path string.
 *
 * If the route requires path variables and/or query parameters, you can pass
 * them over the `params` prop.
 */
export function NavLink<T extends Routeway>(props: NavLinkProps<T>): ReactElement {
  const { to, params, ...rest } = props;

  const url = useMemo((): string => {
    return to.makeUrl(params);
  }, [to, params]);

  return <OriginalNavLink {...rest} to={url} />;
}
