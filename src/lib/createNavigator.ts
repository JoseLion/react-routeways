import { Codec, Routeway } from "ts-routeways";
import { PathLike, RouteParams } from "ts-routeways/dist/lib/commons.types";

import { config } from "./config/Config";
import { safeKeys } from "./helpers/commons";

type NavigatorHook<T extends Record<string, Routeway>> =
  T extends Record<string, Routeway>
    ? { [K in keyof T]: T[K] extends Routeway<PathLike, infer V, infer Q, infer S>
          ? keyof S extends never
            ? NavigateMethods<V, Q>
            : NavigatorHook<S> & NavigateMethods<V, Q>
          : never
      }
    : never;

interface NavigateOptions<S> {
  state?: S;
}

type NavigateMethods<
  V extends Record<string, Codec<unknown>>,
  Q extends Record<string, Codec<unknown>>,
> = keyof V extends never
      ? {
        navigate<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
        replace<S>(params?: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
      }
      : {
        navigate<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
        replace<S>(params: RouteParams<V, Q>, options?: NavigateOptions<S>): void;
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

    const routesAsNavigator = <S extends Record<string, Routeway>>(routeMap: S): NavigatorHook<S> =>
      safeKeys(routeMap).reduce((acc, key) => {
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
              replace(params, options = { }) {
                const { state } = options;
                const replace = true;

                navigator(route.makeUrl(params), { replace, state });
              },
            },
          };
        }

        return acc;
      }, { } as NavigatorHook<S>);

    return routesAsNavigator(routes);
  };

  return useNavigator;
}
