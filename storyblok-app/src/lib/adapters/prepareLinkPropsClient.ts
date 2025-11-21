'use client';

import { useDataContext } from '@/components/DataContext';
import { prepareLinkProps as prepareLinkPropsBase } from './prepareLinkProps';
import type { LinkProps, LinkStoryblok } from './prepareLinkProps';

export const prepareLinkProps = (props?: LinkStoryblok): LinkProps => {
  const { allResolvedLinks } = useDataContext();
  return prepareLinkPropsBase(props, allResolvedLinks);
};

