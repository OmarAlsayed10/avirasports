import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/lib/locale";
import { tr } from "@/lib/i18n/translations";
import { listCategories } from "@/lib/queries/categories";
import {
  CONTACT_LINKS,
  getServiceLinks,
  getSocialLinks,
} from "@/lib/constants/footer";

export async function Footer() {
  const locale = getLocale();
  const t = tr(locale);

  const allCategories = await listCategories();
  const categoryLinks = allCategories.slice(0, 6).map((cat) => ({
    href: `/shop?category=${cat.slug}`,
    label: locale === "ar" ? (cat.nameAr ?? cat.name) : cat.name,
  }));

  const SERVICE_LINKS = getServiceLinks(t);
  const SOCIAL_LINKS = getSocialLinks(t);

  return (
    <footer className="bg-bg-dark dark:bg-white text-text-on-dark dark:text-text-primary">
      <div className="max-w-content mx-auto px-site py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="inline-block bg-white dark:bg-bg-dark rounded mb-1">
              <Image
                src="/avira-logo.png"
                alt="Avira"
                width={800}
                height={800}
                className="h-10 w-auto"
                unoptimized
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-btn mb-3">
              {t.footer.tagline}
            </p>
            <p className="text-sm text-text-footer-link dark:text-text-secondary leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-footer-link dark:text-text-secondary hover:text-text-on-dark dark:hover:text-text-primary transition-colors"
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

        <div className="border-t border-border-footer dark:border-border-primary/20 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-footer-link dark:text-text-secondary">
            {t.footer.copyright(new Date().getFullYear())}
          </p>
          <p className="text-xs text-text-footer-link dark:text-text-secondary">
            {t.footer.taglineBottom}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-on-dark dark:text-text-primary mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-footer-link dark:text-text-secondary hover:text-text-on-dark dark:hover:text-text-primary transition-colors break-all"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Footer;
