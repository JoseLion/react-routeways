import { useCallback, useMemo } from "react";
import { Routeway } from "ts-routeways";

import { config } from "./config/Config";

export interface Navigation {
  /**
   * Navigates to the specified route by pushing a state to the history. The
   * first argument is a Routeways route, allowing its types definitions to let
   * you know if path variables are required (with type checks). You can also
   * pass query parameters when registered to the route. Both path vars and
   * query params can be added in the second argument.
   *
   * @example
   * ```
   * function MyComp(): ReactElement {
   *   cosnt { navigate } = useNavigation();
   *
   *   const handleClick = (): void => {
   *     navigate(MainRoutes.users.edit, { userId: 523 });
   *   };
   *
   *   return ...
   * }
   * ```
   *
   * @param route the route to navigate to
   * @param params the path vars and/or query params of the route (if any)
   */
  navigate: <T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>) => void;
  /**
   * Navigates to the specified route by resetting the current history. The
   * first argument is a Routeways route, allowing its types definitions to let
   * you know if path variables are required (with type checks). You can also
   * pass query parameters when registered to the route. Both path vars and
   * query params can be added in the second argument.
   *
   * @example
   * ```
   * function MyComp(): ReactElement {
   *   cosnt { reset } = useNavigation();
   *
   *   const handleClick = (): void => {
   *     navigate(MainRoutes.home, { dashboard: true });
   *   };
   *
   *   return ...
   * }
   * ```
   *
   * @param route the route to navigate to
   * @param params the path vars and/or query params of the route (if any)
   */
  reset: <T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>) => void;
}

/**
 * React hook which returns a `Navigation` object that contains navigations
 * functions that can be used with Routeways routes.
 *
 * @returns a `Navigation` object
 */
export function useNavigation(): Navigation {
  const navigator = config.useNavigator();

  const navigate = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): void => {
    const url = route.makeUrl(...params);

    navigator(url, { replace: false });
  }, [navigator]);

  const reset = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): void => {
    const url = route.makeUrl(...params);

    navigator(url, { replace: true });
  }, [navigator]);

  return useMemo((): Navigation => ({
    navigate,
    reset,
  }), [navigate, reset]);
}
