import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { safeKeys } from "../helpers/commons";

import type { CodecMap, PathLike, RouteParams, Routeway } from "ts-routeways";

export type NavigatorHook<T extends Record<string, Routeway>> = {
  [K in keyof T]: T[K] extends Routeway<PathLike, infer V, infer Q, infer S>
    ? keyof S extends never
      ? NavigateMethods<V, Q>
      : NavigatorHook<S> & NavigateMethods<V, Q>
    : never
};

export interface NavigateOptions<S> {
  state?: S;
}

export type NavigateMethods<V extends CodecMap, Q extends CodecMap> =
  keyof V extends never
    ? {
      navigate<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
      reset<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
    }
    : {
      navigate<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
      reset<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
    };

/**
 * Creates a hook that returns a "Navigator" obeject from your custom routes.
 * This provides natural experience of imperative navigation based on your
 * routes structure.
 *
 * @param routes the custom `Routeways` routes
 * @returns a navigation hook of the custom `Routeways` routes
 */
export function createNavigatorHook<T extends Record<string, Routeway>>(routes: T): () => NavigatorHook<T> {
  return () => {
    const navigate = useNavigate();

    const routesAsNavigator = useCallback(<S extends Record<string, Routeway>>(routeMap: S): NavigatorHook<S> => {
      return safeKeys(routeMap).reduce((acc, key) => {
        const route = routeMap[key];

        if (route !== undefined) {
          const subRoutes = Object.entries(route)
            .filter(entry => typeof entry[1] !== "function")
            .reduce<S>((sr, [k, v]) => {
              return { ...sr, [k]: v };
            }, { } as S);

          return {
            ...acc,
            [key]: {
              ...routesAsNavigator(subRoutes),
              navigate(params, options = { }) {
                const { state } = options;
                const replace = false;

                navigate(route.makeUrl(params), { replace, state });
              },
              reset(params, options = { }) {
                const { state } = options;
                const replace = true;

                navigate(route.makeUrl(params), { replace, state });
              },
            },
          };
        }

        return acc;
      }, { } as NavigatorHook<S>);
    }, [navigate]);

    return useMemo((): NavigatorHook<T> => {
      return routesAsNavigator(routes);
    }, [routesAsNavigator, routes]);
  };
}
