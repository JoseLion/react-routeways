/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from "expect-type";

import { createNavigator } from "../../../src/lib/createNavigator";
import { TestRoutes } from "../../helpers/routes";

const useNavigator = createNavigator(TestRoutes);

const { home, library } = useNavigator();

expectTypeOf(useNavigator).toBeFunction();

expectTypeOf(home).toMatchTypeOf<{
  navigate: () => void;
  reset: () => void;
}>();

expectTypeOf(library).toMatchTypeOf<{
  author: {
    book: {
      navigate: (params: { authorId: number; bookId: number; libId: number; }) => void;
      reset: (params: { authorId: number; bookId: number; libId: number; }) => void;
    };
    navigate: (params: { authorId: number; libId: number; }) => void;
    reset: (params: { authorId: number; libId: number; }) => void;
  };
  navigate: (params: { libId: number; }) => void;
  reset: (params: { libId: number; }) => void;
}>();

// @ts-expect-error
expectTypeOf(library).toMatchTypeOf<{
  navigate: () => void;
  reset: () => void;
}>();

// @ts-expect-error
expectTypeOf(library.author).toMatchTypeOf<{
  navigate: (params: { libId: number; }) => void;
  reset: (params: { libId: number; }) => void;
}>();

// @ts-expect-error
expectTypeOf(library.author.book).toMatchTypeOf<{
  navigate: (params: { bookId: number; libId: number; }) => void;
  reset: (params: { bookId: number; libId: number; }) => void;
}>();
