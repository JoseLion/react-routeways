import { useCallback, useMemo } from "react";
import { Codec, Routeway } from "ts-routeways";
import { PathLike, RouteParams } from "ts-routeways/dist/lib/commons.types";

import { config } from "./config/Config";
import { safeKeys } from "./helpers/commons";

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

export type NavigateMethods<
  V extends Record<string, Codec<unknown>>,
  Q extends Record<string, Codec<unknown>>,
> = keyof V extends never
      ? {
        navigate<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
        reset<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
      }
      : {
        navigate<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
        reset<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
      };

/**
 * Creates a hook that returns a "Navigator" of your custom routes. This
 * provides a more natural experience when imperative navigation is required.
 *
 * @param routes the custom `Routeways` routes
 * @param getNavigate a function or hook that provideds a navigation function
 * @returns a navigation hook of the custom `Routeways` routes
 */
export function createNavigator<T extends Record<string, Routeway>>(routes: T): () => NavigatorHook<T> {
  const useNavigator = (): NavigatorHook<T> => {
    const navigator = config.useNavigator();

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

                navigator(route.makeUrl(params), { replace, state });
              },
              reset(params, options = { }) {
                const { state } = options;
                const replace = true;

                navigator(route.makeUrl(params), { replace, state });
              },
            },
          };
        }

        return acc;
      }, { } as NavigatorHook<S>);
    }, [navigator]);

    return useMemo((): NavigatorHook<T> => {
      return routesAsNavigator(routes);
    }, [routesAsNavigator, routes]);
  };

  return useNavigator;
}
