const mapRoutes = <T extends string>(object: Record<T, string>, fn: (value: string) => string): Record<T, string> =>
  Object.fromEntries(Object.entries<string>(object).map(([key, value]) => [key, fn(value)])) as Record<T, string>;

export const nestedRoute = <T extends string>(root: string, nestedRoutes: Record<T, string>) => {
  const absoluteNestedUrls = mapRoutes(nestedRoutes, (value) => root + value);
  return {
    index: root,
    ...absoluteNestedUrls,
    getRelativeUrl: (route: T) => nestedRoutes[route],
  };
};

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  notFound: '/404',
  profile: '/profile',
  confirmEmail: '/auth/confirm/:user?/:token?',
  passwordReset: nestedRoute('/auth/reset-password', {
    confirm: '/confirm/:user?/:token?',
  }),
};