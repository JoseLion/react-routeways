import { expectTypeOf } from "expect-type";

import { type UseQueryParam, useQueryParam } from "../../../../src/lib/hooks/useQueryParam.hook";
import { TestRoutes } from "../../../helpers/routes";

import type { Optional } from "../../../../src/lib/helpers/commons";

const { home, library } = TestRoutes;

expectTypeOf(useQueryParam(home, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();

expectTypeOf(useQueryParam(library, "page")).toEqualTypeOf<UseQueryParam<Optional<number>>>();
expectTypeOf(useQueryParam(library, "search")).toEqualTypeOf<UseQueryParam<Optional<string>>>();

expectTypeOf(useQueryParam(library, "page", 1)).toEqualTypeOf<UseQueryParam<number>>();
expectTypeOf(useQueryParam(library, "search", "foo")).toEqualTypeOf<UseQueryParam<string>>();

// @ts-expect-error
expectTypeOf(useQueryParam(library, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();

// @ts-expect-error
expectTypeOf(useQueryParam(library, "search", 1)).toEqualTypeOf<UseQueryParam<number>>();
