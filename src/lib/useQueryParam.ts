import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CodecMap, CodecsToRecord, PathLike, Routeway } from "ts-routeways";

import { NonOptional, Optional } from "./helpers/commons";

type UseQueryParam<T> = [T, Dispatch<SetStateAction<T>>];

type SetQueryParam<
  Q extends CodecMap,
  K extends Extract<keyof Q, string>,
> = SetStateAction<Partial<CodecsToRecord<Q>>[K]>;

/**
 * Returns a tuple of a steteful value of the specified query param, and a
 * function to update it. Just like the {@link useState} hook would.
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
 * Returns a tuple of a steteful value of the specified query param, and a
 * function to update it. Just like the {@link useState} hook would.
 *
 * However, because the source of truth for this state is the current url,
 * whenever the state is updated in one component, it will be also updated in
 * other components using the same query param state. This keeps consistency
 * across the state and the URL all the time.
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
  const { hash, pathname, search } = useLocation();
  const navigate = useNavigate();

  const eventType = useMemo(
    (): string => `setQueryParam[${key}]`,
    [key]
  );
  const url = useMemo(
    (): string => `${pathname}${hash}${search}`,
    [pathname, hash, search]
  );

  const [queryParam, setQueryParam] = useState(route.parseUrl(url).queryParams[key]);

  const dispatch = useCallback((value: SetQueryParam<Q, K>): void => {
    const event = new CustomEvent<SetQueryParam<Q, K>>(eventType, { detail: value });
    window.dispatchEvent(event);
  }, [window]);

  useEffect(() => {
    const listener = (event: Event | CustomEvent<SetQueryParam<Q, K>>): void => {
      if ("detail" in event) {
        setQueryParam(event.detail);
      }
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [window]);

  useEffect(() => {
    const { pathVars, queryParams } = route.parseUrl(url);
      const path = route.makeUrl({
        ...pathVars,
        ...queryParams,
        [key]: queryParam,
      });

    navigate(path);
  }, [queryParam, url]);

  return [
    queryParam ?? fallback,
    dispatch,
  ];
}
