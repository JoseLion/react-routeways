/* eslint-disable react-hooks/rules-of-hooks */
import { expectType, expectAssignable } from "tsd";

import { Navigation, useNavigation } from "../../src/lib/useNavigation";
import { TestRoutes } from "../../test/helpers/routes";

const { home, library } = TestRoutes;

const { navigate, reset } = useNavigation();

expectType<Navigation>({ navigate, reset });

expectAssignable<(route: typeof home) => void>(navigate as typeof navigate<typeof home>);
expectAssignable<(route: typeof library, params: { libId: number; }) => void>(
  navigate as typeof navigate<typeof library>
);
expectAssignable<(route: typeof library.author, params: { authorId: number; libId: number; }) => void>(
  navigate as typeof navigate<typeof library.author>
);

expectAssignable<(route: typeof home) => void>(reset as typeof reset<typeof home>);
expectAssignable<(route: typeof library, params: { libId: number; }) => void>(
  reset as typeof reset<typeof library>
);
expectAssignable<(route: typeof library.author, params: { authorId: number; libId: number; }) => void>(
  reset as typeof reset<typeof library.author>
);
