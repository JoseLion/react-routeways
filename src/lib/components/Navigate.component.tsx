import { ReactElement, useMemo } from "react";
import { Navigate as OriginalNavigate, NavigateProps as OriginalNavigateProps } from "react-router-dom";
import { CodecMap, PathLike, Routeway } from "ts-routeways";

export interface BaseNavigateProps<T extends Routeway> {
  /**
   * The `Routeway` route to navigate to.
   */
  to: T;
}

export type ParamNavigateProps<T extends Routeway> =
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

export type NavigateProps<T extends Routeway> =
  & BaseNavigateProps<T>
  & ParamNavigateProps<T>
  & Omit<OriginalNavigateProps, "to">;

/**
 * A wrapper over react-router-dom's `<Navigate>` component, with the difference
 * that the `to` prop expects a `Routeway` route instead of a path string.
 *
 * If the route requires path variables and/or query parameters, you can pass
 * them over the `params` prop.
 */
export function Navigate<T extends Routeway>(props: NavigateProps<T>): ReactElement {
  const { to, params, ...rest } = props;

  const url = useMemo((): string => {
    return to.makeUrl(params);
  }, [to, params]);

  return <OriginalNavigate {...rest} to={url} />;
}
