import { useNavigate } from "react-router-dom";

export interface NavigateOptions<S> {
  replace?: boolean;
  state?: S;
}

type Navigator<S = unknown> = (to: string | URL, options: NavigateOptions<S>) => void;

class Config {

  public useNavigator: <S>() => Navigator<S>;

  public constructor() {
    this.useNavigator = useNavigate;
  }

  public setUseNavigator(useNavigator: <S>() => Navigator<S>): void {
    this.useNavigator = useNavigator;
  }
}

export const config = new Config();
