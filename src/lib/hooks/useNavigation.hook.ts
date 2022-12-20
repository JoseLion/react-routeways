import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Routeway } from "ts-routeways";

export interface Navigation {
  /**
   * Creates a stable callback that navigates to the specified route by pushing
   * a state to the history, the same way as {@link navigate} would. Ideal to
   * use on event props of React elements.
   *
   * This function is the equivalent of wrapping the {@link navigate} function
   * on a `React.useCallback(..)` hook.
   *
   * @example
   * ```
   * function MyComp(): ReactElement {
   *   cosnt { goTo } = useNavigation();
   *
   *   return (
   *     <Button
   *       variant="secondary"
   *       onClick={goTo(MainRoutes.users.edit, { userId: 523 })}
   *     >
   *       Edit User
   *     </Button>
   *   )
   * }
   * ```
   *
   * @param route the route to navigate to
   * @param params the path vars and/or query params of the route (if any)
   */
  goTo: <T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>) => () => void;
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
  /**
   * Creates a stable callback that navigates to the specified route by
   * resetting the current history, the same way as {@link reset} would. Ideal
   * to use on event props of React elements.
   *
   * This function is the equivalent of wrapping the {@link reset} function on
   * a `React.useCallback(..)` hook.
   *
   * @example
   * ```
   * function MyComp(): ReactElement {
   *   cosnt { resetTo } = useNavigation();
   *
   *   return (
   *     <Button
   *       variant="primary"
   *       onClick={resetTo(MainRoutes.home, { dashboard: true })}
   *     >
   *       Restart
   *     </Button>
   *   )
   * }
   * ```
   *
   * @param route the route to navigate to
   * @param params the path vars and/or query params of the route (if any)
   */
  resetTo: <T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>) => () => void;
}

/**
 * Returns an object which contains navigation functions that can be used along
 * with `Routeways` routes.
 *
 * @returns an object with navigation functions
 */
export function useNavigation(): Navigation {
  const navigator = useNavigate();

  const goTo = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): (() => void) => {
    return (): void => {
      const url = route.makeUrl(...params);

      navigator(url, { replace: false });
    };
  }, [navigator]);

  const navigate = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): void => {
    const url = route.makeUrl(...params);

    navigator(url, { replace: false });
  }, [navigator]);

  const reset = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): void => {
    const url = route.makeUrl(...params);

    navigator(url, { replace: true });
  }, [navigator]);

  const resetTo = useCallback(<T extends Routeway>(route: T, ...params: Parameters<T["makeUrl"]>): (() => void) => {
    return () => {
      const url = route.makeUrl(...params);

      navigator(url, { replace: true });
    };
  }, [navigator]);

  return useMemo((): Navigation => ({
    goTo,
    navigate,
    reset,
    resetTo,
  }), [navigate, reset]);
}
