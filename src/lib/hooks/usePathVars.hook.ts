import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { isFunctionAction } from "../helpers/commons";

export type UsePathVars<V extends Record<string, unknown>> = [
  V,
  Dispatch<SetStateAction<V>>,
];

/**
 * Returns a tuple of a stateful value of the path variables, and a
 * function to update them. Just like the {@link https://beta.reactjs.org/apis/react/useState useState}
 * hook would.
 *
 * However, because changing path variables means that the current location may
 * also be different, an update to the path variables will produce a navigate
 * using the updated values.
 *
 * @param route the `Routeway` route to use to parse the path variables
 * @returns a stateful value of the path variables, and a function to update
 *          them
 */
export function usePathVars<T extends Routeway>(route: T): UsePathVars<ReturnType<T["parseUrl"]>["pathVars"]> {
  const location = useLocation();
  const navigate = useNavigate();

  const url = useMemo((): string => {
    const { hash, pathname, search } = location;
    return `${pathname}${hash}${search}`;
  }, [location]);

  const [pathVars, setPathVars] = useState(() => route.parseUrl(url).pathVars);

  const dispatch = useCallback((value: SetStateAction<ReturnType<T["parseUrl"]>["pathVars"]>): void => {
    const { queryParams } = route.parseUrl(url);
    const newPathVars = isFunctionAction(value)
      ? value(pathVars)
      : value;

    setPathVars(newPathVars);
    navigate(route.makeUrl({ ...newPathVars, ...queryParams }));
  }, [url, pathVars]);

  return [pathVars, dispatch];
}
