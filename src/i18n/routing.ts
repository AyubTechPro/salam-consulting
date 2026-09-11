import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['tg', 'ru', 'en'],
  defaultLocale: 'tg'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
