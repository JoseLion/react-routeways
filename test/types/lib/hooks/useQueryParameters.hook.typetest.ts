/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { useQueryParameters, UseQueryParameters } from "../../../../src/lib/hooks/useQueryParameters.hook";
import { TestRoutes } from "../../../helpers/routes";

const { home, library } = TestRoutes;

expectTypeOf(useQueryParameters(home)).toEqualTypeOf<UseQueryParameters<Record<never, never>>>();
expectTypeOf(useQueryParameters(library)).toEqualTypeOf<UseQueryParameters<{
  page?: number;
  search?: string;
}>>();

// @ts-expect-error
expectTypeOf(useQueryParameters(library)).toEqualTypeOf<UseQueryParameters<{
  foo?: boolean;
  other?: string;
}>>();
