import { Facebook, Instagram } from 'lucide-react';
import type { Translations } from '@/lib/i18n/translations';

export const CONTACT_LINKS = [
  { href: 'mailto:avira.sportswear@gmail.com', label: 'avira.sportswear@gmail.com' },
  { href: 'tel:+201278765677', label: '+20 1278765677' },
];

export function getServiceLinks(t: Translations) {
  return [
    { href: '/track-order', label: t.footer.links.trackOrder },
    { href: '/about', label: t.footer.links.about },
  ];
}

export function getSocialLinks(t: Translations) {
  return [
    { href: 'https://www.facebook.com/profile.php?id=61581673603001', label: t.footer.links.facebook, Icon: Facebook },
    { href: 'https://www.instagram.com/avira_sport?fbclid=IwY2xjawRrVL5leHRuA2FlbQIxMABicmlkETFDMmVDQm9pQkk0c3g3dGdYc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHljSMBnLTUtWs90ufl9jPCTI86S8PsqVJ_0qF_gqcirI5SZcom-E5zY4DoWb_aem_34ptxbuRVn7wldWf8MzjnQ', label: t.footer.links.instagram, Icon: Instagram },
  ];
}
