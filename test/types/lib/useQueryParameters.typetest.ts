/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { useQueryParameters, UseQueryParameters } from "../../../src/lib/useQueryParameters";
import { TestRoutes } from "../../helpers/routes";

expectTypeOf(useQueryParameters(TestRoutes.home)).toEqualTypeOf<UseQueryParameters<Record<never, never>>>();
expectTypeOf(useQueryParameters(TestRoutes.library)).toEqualTypeOf<UseQueryParameters<{
  page?: number;
  search?: string;
}>>();

// @ts-expect-error
expectTypeOf(useQueryParameters(TestRoutes.library)).toEqualTypeOf<UseQueryParameters<{
  foo?: boolean;
  other?: string;
}>>();
