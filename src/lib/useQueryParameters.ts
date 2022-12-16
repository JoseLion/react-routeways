import { useEffect, useMemo, useState, Dispatch, SetStateAction, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { CodecMap, CodecsToRecord, PathLike, Routeway } from "ts-routeways";
import { deepEqual } from "fast-equals";

export type UseQueryParameters<Q extends CodecMap> = [
  Partial<CodecsToRecord<Q>>,
  Dispatch<SetStateAction<Partial<CodecsToRecord<Q>>>>,
];

/**
 * Returns a tuple of a steteful value of the query parameters, and a
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
export function useQueryParameters<Q extends CodecMap>(route: Routeway<PathLike, CodecMap, Q>): UseQueryParameters<Q> {
  const { hash, pathname, search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const url = useMemo(
    (): string => `${pathname}${hash}${search}`,
    [pathname, hash, search]
  );

  const [queryParams, setQueryParams] = useState(() => route.parseUrl(url).queryParams);

  const dispatch = useCallback((value: SetStateAction<Partial<CodecsToRecord<Q>>>): void => {
    setSearchParams(Object.entries(value));
  }, [setSearchParams]);

  useEffect(() => {
    const newParams = route.parseUrl(url).queryParams;

    if (!deepEqual(newParams, queryParams)) {
      setQueryParams(newParams);
    }
  }, [searchParams]);

  return [queryParams, dispatch];
}
