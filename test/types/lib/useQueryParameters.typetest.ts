/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";
import { Codec } from "ts-routeways";

import { useQueryParameters, UseQueryParameters } from "../../../src/lib/useQueryParameters";
import { TestRoutes } from "../../helpers/routes";

expectTypeOf(useQueryParameters(TestRoutes.home)).toEqualTypeOf<UseQueryParameters<Record<never, never>>>();
expectTypeOf(useQueryParameters(TestRoutes.library)).toEqualTypeOf<UseQueryParameters<{
  page?: Codec<number>;
  search?: Codec<string>;
}>>();

// @ts-expect-error
expectTypeOf(useQueryParameters(TestRoutes.library)).toEqualTypeOf<UseQueryParameters<{
  foo?: Codec<boolean>;
  other?: Codec<string>;
}>>();
