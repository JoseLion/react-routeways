import { useEffect, useMemo, useState, Dispatch, SetStateAction, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Routeway } from "ts-routeways";

import { isFunctionAction } from "../helpers/commons";

export type UseQueryParameters<Q extends Record<string, unknown>> = [
  Partial<Q>,
  Dispatch<SetStateAction<Partial<Q>>>,
];

const eventType = "setQueryParameters";

/**
 * Returns a tuple of a stateful value of the query parameters, and a
 * function to update them. Just like the {@link useState} hook would.
 *
 * However, because the source of truth for this state is the current url,
 * whenever the state is updated in one component, it will be also updated in
 * other components using the same state from this hook. This keeps consistency
 * across the state and the URL all the time.
 *
 * @param route the `Routeway` route to use to parse the query parameters
 * @returns a stateful value of the query parameters, and a function to update
 *          them
 */
export function useQueryParameters<T extends Routeway>(
  route: T
): UseQueryParameters<ReturnType<T["parseUrl"]>["queryParams"]> {
  const location = useLocation();
  const navigate = useNavigate();

  const url = useMemo((): string => {
    const { hash, pathname, search } = location;
    return `${pathname}${hash}${search}`;
  }, [location]);

  const [queryParams, setQueryParams] = useState(() => route.parseUrl(url).queryParams);

  const dispatch = useCallback((value: SetStateAction<ReturnType<T["parseUrl"]>["queryParams"]>): void => {
    const detail = isFunctionAction(value)
      ? value(queryParams)
      : value;
    const event = new CustomEvent<ReturnType<T["parseUrl"]>["queryParams"]>(eventType, { detail });

    setQueryParams(detail);
    window.dispatchEvent(event);
  }, [queryParams, window]);

  useEffect(() => {
    const listener = (event: Event | CustomEvent<ReturnType<T["parseUrl"]>["queryParams"]>): void => {
      if ("detail" in event) {
        const { pathVars } = route.parseUrl(url);

        setQueryParams(event.detail);
        navigate(route.makeUrl({ ...pathVars, ...event.detail }));
      }
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [window, url, navigate]);

  return [queryParams, dispatch];
}
