/* eslint-disable react-hooks/rules-of-hooks */
import { Codec } from "ts-routeways";
import { expectType, expectAssignable } from "tsd";

import { useQueryParameters, UseQueryParameters } from "../../src/lib/useQueryParameters";
import { TestRoutes } from "../../test/helpers/routes";


expectType<UseQueryParameters<Record<never, never>>>(useQueryParameters(TestRoutes.home));
expectType<UseQueryParameters<{ page: Codec<number>; search: Codec<string>; }>>(useQueryParameters(TestRoutes.library));

expectAssignable<Record<never, never>>(useQueryParameters(TestRoutes.home)[0]);
expectAssignable<(value: Record<never, never>) => void>(useQueryParameters(TestRoutes.library)[1]);

expectAssignable<{ page?: number; search?: string; }>(useQueryParameters(TestRoutes.library)[0]);
expectAssignable<(value: { page?: number; search?: string; }) => void>(useQueryParameters(TestRoutes.library)[1]);
