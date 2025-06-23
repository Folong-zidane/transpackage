/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/client/ChatScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/AssistantScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/agency/LogistiqueScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/agency/CreatePersonnelScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/../screens/client/ChatScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/../screens/AssistantScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/../screens/agency/LogistiqueScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/../screens/agency/CreatePersonnelScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/../screens/client/ChatScreen${`?${string}` | `#${string}` | ''}` | `/../screens/AssistantScreen${`?${string}` | `#${string}` | ''}` | `/../screens/agency/LogistiqueScreen${`?${string}` | `#${string}` | ''}` | `/../screens/agency/CreatePersonnelScreen${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/client/ChatScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/AssistantScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/agency/LogistiqueScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../screens/agency/CreatePersonnelScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
