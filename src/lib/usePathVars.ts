import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Routeway } from "ts-routeways";

/**
 * Extracts the type of the path variables of a route.
 */
export type PathVars<T extends Routeway> = ReturnType<T["parseUrl"]>["pathVars"];

/**
 * Parses the path variables of the current location using the codecs of the
 * provided route.
 *
 * @example
 * ```
 * function EditUser(): ReactElement {
 *   const { userId } = usePathVars(MainRoutes.users.edit);
 *
 *   return ...
 * }
 * ```
 *
 * @param route the route to use to parse the path vars
 * @returns the path variables of the current location
 */
export function usePathVars<T extends Routeway>(route: T): PathVars<T> {
  const { hash, pathname, search } = useLocation();

  return useMemo((): PathVars<T> => {
    const { pathVars } = route.parseUrl(`${pathname}${hash}${search}`);

    return pathVars;
  }, [hash, pathname, search]);
}
