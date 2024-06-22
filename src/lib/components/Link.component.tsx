import { type ReactElement, useMemo } from "react";
import { Link as OriginalLink, type LinkProps as OriginalLinkProps } from "react-router-dom";

import type { CodecMap, PathLike, Routeway } from "ts-routeways";

export interface BaseLinkProps<T extends Routeway> {
  /**
   * The `Routeway` route to navigate to.
   */
  to: T;
}

export type ParamLinkProps<T extends Routeway> =
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

export type LinkProps<T extends Routeway> =
  & BaseLinkProps<T>
  & ParamLinkProps<T>
  & Omit<OriginalLinkProps, "to">;

/**
 * A wrapper over react-router-dom's `<Link>` component, with the difference
 * that the `to` prop expects a `Routeway` route instead of a path string.
 *
 * If the route requires path variables and/or query parameters, you can pass
 * them over the `params` prop.
 */
export function Link<T extends Routeway>(props: LinkProps<T>): ReactElement {
  const { to, params, ...rest } = props;

  const url = useMemo((): string => {
    return to.makeUrl(params);
  }, [to, params]);

  return <OriginalLink {...rest} to={url} />;
}
