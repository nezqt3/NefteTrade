import { NavigateFunction } from 'react-router-dom';

export function switchPage(navigate: NavigateFunction, page: string): void {
  navigate(page);
}
