import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from '@/modules/_shared/i18n/locale';
import { tr } from '@/modules/_shared/i18n/i18n.translations';
import { listCategories } from '@/modules/admin/categories/categories.queries';
import {
  CONTACT_LINKS,
  getServiceLinks,
  getSocialLinks,
} from '@/modules/_shared/constants/footer.constants';
import { footerTokens as tk } from './footer.tokens';

export async function Footer() {
  const locale = getLocale();
  const t = tr(locale);

  const allCategories = await listCategories();
  const categoryLinks = allCategories.slice(0, 6).map((cat) => ({
    href: `/shop?category=${cat.slug}`,
    label: locale === 'ar' ? (cat.nameAr ?? cat.name) : cat.name,
  }));

  const SERVICE_LINKS = getServiceLinks(t);
  const SOCIAL_LINKS = getSocialLinks(t);

  return (
    <footer className={tk.root}>
      <div className={tk.inner}>
        <div className={tk.grid}>
          <div className={tk.brand}>
            <div className={tk.logoWrapper}>
              <Image
                src="/avira-logo.png"
                alt="Avira"
                width={800}
                height={800}
                className="h-10 w-auto"
                unoptimized
              />
            </div>
            <p className={tk.tagline}>{t.footer.tagline}</p>
            <p className={tk.description}>{t.footer.description}</p>
            <div className={tk.socialLinks}>
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tk.socialLink}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t.footer.categories} links={categoryLinks} />
          <FooterColumn title={t.footer.contactUs} links={CONTACT_LINKS} />
          <FooterColumn title={t.footer.services} links={SERVICE_LINKS} />
        </div>

        <div className={tk.bottomBar}>
          <p className={tk.bottomText}>{t.footer.copyright(new Date().getFullYear())}</p>
          <p className={tk.bottomText}>{t.footer.taglineBottom}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className={tk.column.heading}>{title}</h3>
      <ul className={tk.column.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={tk.column.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Footer;
