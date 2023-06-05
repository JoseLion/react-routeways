import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CodecMap, CodecsToRecord, PathLike, Routeway } from "ts-routeways";

import { isFunctionAction, NonOptional, Optional } from "../helpers/commons";

export type UseQueryParam<T> = [T, Dispatch<SetStateAction<T>>];

type SetQueryParam<
  Q extends CodecMap,
  K extends Extract<keyof Q, string>,
> = SetStateAction<Partial<CodecsToRecord<Q>>[K]>;

const undef = Symbol("represents an undefined detail on useQueryParam hook");

/**
 * Returns a tuple of a stateful value of the specified query param, and a
 * function to update it. Just like the {@link https://beta.reactjs.org/apis/react/useState useState}
 * hook would.
 *
 * However, because the source of truth for this state is the current url,
 * whenever the state is updated in one component, it will be also updated in
 * other components using the same query param state. This keeps consistency
 * across the state and the URL all the time.
 *
 * @param route the `Routeway` route to use to parse the query param
 * @param key the key of the specific query param to use
 * @returns a stateful value of the query param, and a function to update it
 */
export function useQueryParam<Q extends CodecMap, K extends Extract<keyof Q, string>>(
  route: Routeway<PathLike, CodecMap, Q>,
  key: K
): UseQueryParam<Optional<CodecsToRecord<Q>[K]>>;
/**
 * Returns a tuple of a stateful value of the specified query param, and a
 * function to update it. Just like the {@link https://beta.reactjs.org/apis/react/useState useState}
 * hook would.
 *
 * However, because the source of truth for this state is the current location,
 * whenever the state is updated in one component, it will be also updated in
 * other components using the same query param state. This keeps consistency
 * across the state and the location all the time.
 *
 * @param route the `Routeway` route to use to parse the query param
 * @param key the key of the specific query param to use
 * @param fallback an optional fallback value in case the query param is not
 *                 present in the url, `undefined`, or `null`
 * @returns a stateful value of the query param, and a function to update it
 */
export function useQueryParam<Q extends CodecMap, K extends Extract<keyof Q, string>>(
  route: Routeway<PathLike, CodecMap, Q>,
  key: K,
  fallback: CodecsToRecord<Q>[K],
): UseQueryParam<NonOptional<CodecsToRecord<Q>[K]>>;
export function useQueryParam<Q extends CodecMap, K extends Extract<keyof Q, string>>(
  route: Routeway<PathLike, CodecMap, Q>,
  key: K,
  fallback?: CodecsToRecord<Q>[K],
): UseQueryParam<Optional<CodecsToRecord<Q>[K]> | NonOptional<CodecsToRecord<Q>[K]>> {
  const location = useLocation();
  const navigate = useNavigate();

  const eventType = useMemo(
    (): string => `setQueryParam[${key}]`,
    [key],
  );
  const url = useMemo((): string => {
    const { hash, pathname, search } = location;
    return `${pathname}${hash}${search}`;
  }, [location]);

  const [queryParam, setQueryParam] = useState(route.parseUrl(url).queryParams[key]);

  const dispatch = useCallback((value: SetQueryParam<Q, K>): void => {
    const result = isFunctionAction(value)
      ? value(queryParam)
      : value;
    const detail = typeof result === "undefined"
      ? undef
      : result;
    const event = new CustomEvent<SetQueryParam<Q, K> | typeof undef>(eventType, { detail });

    setQueryParam(value);
    window.dispatchEvent(event);
  }, [queryParam, window]);

  useEffect(() => {
    const listener = (event: Event | CustomEvent<SetQueryParam<Q, K> | typeof undef>): void => {
      if ("detail" in event) {
        const { pathVars, queryParams } = route.parseUrl(url);
        const value = event.detail === undef
          ? undefined
          : event.detail;

        setQueryParam(value);
        navigate(route.makeUrl({ ...pathVars, ...queryParams, [key]: value }));
      }
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [window, url, navigate]);

  return [
    queryParam ?? fallback,
    dispatch,
  ];
}
