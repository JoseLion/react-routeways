import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { Routeway } from "ts-routeways";

import { isFunctionAction, NonOptional } from "./helpers/commons";
import { usePathVars } from "./usePathVars";
import { useQueryParameters } from "./useQueryParameters";

export type UseRouteParams<T extends Record<string, unknown>> = [
  T,
  Dispatch<SetStateAction<T>>,
];

/**
 * Returns a tuple of a stateful value of both the path variables and query
 * parameters, and a function to update them. Just like the {@link useState}
 * hook would.
 *
 * This hook uses both {@link usePathVars} and {@link useQueryParameters}, so
 * updating the parameters may have the same effects in both hooks.
 *
 * @param route the `Routeway` route to use to parse the path variables and
 *              query parameters
 * @returns a stateful value of both the path variables and query parameters,
 *          and a function to update them
 *
 * @see {@link usePathVars}
 * @see {@link useQueryParameters}
 */
export function useRouteParams<T extends Routeway>(route: T): UseRouteParams<NonOptional<Parameters<T["makeUrl"]>[0]>> {
  const [pathVars, setPathVars] = usePathVars(route);
  const [queryParams, setQueryParams] = useQueryParameters(route);

  const params = useMemo((): NonOptional<Parameters<T["makeUrl"]>[0]> => {

    return { ...pathVars, ...queryParams } as NonOptional<Parameters<T["makeUrl"]>[0]>;
  }, [pathVars, queryParams]);

  const dispatch = useCallback((value: SetStateAction<NonOptional<Parameters<T["makeUrl"]>[0]>>): void => {
    const newParams = isFunctionAction(value)
      ? value(params)
      : value;

    if (newParams !== undefined) {
      const newPathVars = Object.entries(newParams)
        .reduce((acc, [k, v]) => {
          return k in pathVars
            ? { ...acc, [k]: v }
            : acc;
        }, { } as typeof pathVars);
      const newQueryParams = Object.entries(newParams)
        .reduce((acc, [k, v]) => {
          return !(k in pathVars)
            ? { ...acc, [k]: v }
            : acc;
        }, { } as typeof queryParams);

      setPathVars(newPathVars);
      setQueryParams(newQueryParams);
    }
  }, [params, setPathVars, setQueryParams]);

  return [params, dispatch];
}
