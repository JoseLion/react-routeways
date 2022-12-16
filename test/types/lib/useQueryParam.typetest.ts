/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { Optional } from "../../../src/lib/helpers/commons";
import { UseQueryParam, useQueryParam } from "../../../src/lib/useQueryParam";
import { TestRoutes } from "../../helpers/routes";

expectTypeOf(useQueryParam(TestRoutes.home, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();

expectTypeOf(useQueryParam(TestRoutes.library, "page")).toEqualTypeOf<UseQueryParam<Optional<number>>>();
expectTypeOf(useQueryParam(TestRoutes.library, "search")).toEqualTypeOf<UseQueryParam<Optional<string>>>();

expectTypeOf(useQueryParam(TestRoutes.library, "page", 1)).toEqualTypeOf<UseQueryParam<number>>();
expectTypeOf(useQueryParam(TestRoutes.library, "search", "foo")).toEqualTypeOf<UseQueryParam<string>>();

// @ts-expect-error
expectTypeOf(useQueryParam(TestRoutes.library, "foo")).toEqualTypeOf<UseQueryParam<Optional<unknown>>>();

// @ts-expect-error
expectTypeOf(useQueryParam(TestRoutes.library, "search", 1)).toEqualTypeOf<UseQueryParam<number>>();
