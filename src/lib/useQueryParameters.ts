import { useEffect, useMemo, useState, Dispatch, SetStateAction, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Routeway } from "ts-routeways";
import { deepEqual } from "fast-equals";

export type UseQueryParameters<T extends Routeway> = [
  ReturnType<T["parseUrl"]>["queryParams"],
  Dispatch<SetStateAction<ReturnType<T["parseUrl"]>["queryParams"]>>,
];

export function useQueryParameters<T extends Routeway>(route: T): UseQueryParameters<T> {
  const { hash, pathname, search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const url = useMemo(
    (): string => `${pathname}${hash}${search}`,
    [pathname, hash, search]
  );

  const [queryParams, setQueryParams] = useState(() => route.parseUrl(url).queryParams);

  const dispatch = useCallback((value: typeof queryParams): void => {
    setSearchParams(value);
  }, [setSearchParams]);

  useEffect(() => {
    const newParams = route.parseUrl(url).queryParams;

    if (!deepEqual(newParams, queryParams)) {
      setQueryParams(newParams);
    }
  }, [searchParams]);

  return useMemo(
    (): UseQueryParameters<T> => [queryParams, dispatch],
    [queryParams, dispatch]
  );
}
