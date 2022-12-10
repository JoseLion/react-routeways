/* eslint-disable react-hooks/rules-of-hooks */
import { expectType, expectAssignable } from "tsd";

import { Navigation, useNavigation } from "../../src/lib/useNavigation";
import { TestRoutes } from "../../test/helpers/routes";

const { home, library } = TestRoutes;

const { goTo, navigate, reset, resetTo } = useNavigation();

expectType<Navigation>({ goTo, navigate, reset, resetTo });

expectAssignable<(route: typeof home) => () => void>(goTo as typeof goTo<typeof home>);
expectAssignable<(route: typeof library, params: { libId: number; }) => () => void>(
  goTo as typeof goTo<typeof library>
);
expectAssignable<(route: typeof library.author, params: { authorId: number; libId: number; }) => () => void>(
  goTo as typeof goTo<typeof library.author>
);

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

expectAssignable<(route: typeof home) => () => void>(resetTo as typeof resetTo<typeof home>);
expectAssignable<(route: typeof library, params: { libId: number; }) => () => void>(
  resetTo as typeof resetTo<typeof library>
);
expectAssignable<(route: typeof library.author, params: { authorId: number; libId: number; }) => () => void>(
  resetTo as typeof resetTo<typeof library.author>
);
