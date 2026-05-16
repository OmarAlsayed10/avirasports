import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/infrastructure/db/prisma";
import { getT } from "@/modules/_shared/i18n/locale";
import { toCloudinaryUrl } from "@/modules/_shared/utils/cloudinary-url";
import { homeTokens } from "../home.tokens";
import { cn } from "@/modules/_shared/utils/cn";

type DbCategory = {
  slug: string;
  name: string;
  nameAr: string | null;
  iconUrl: string | null;
};

export async function CategoryCards() {
  const { locale, t } = getT();

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true, nameAr: true, iconUrl: true },
  });

  if (categories.length === 0) return null;

  const [large1, large2, ...small] = categories;

  return (
    <section className={homeTokens.categoryCards.section}>
      <div className={homeTokens.categoryCards.inner}>
        <div className={homeTokens.categoryCards.header}>
          <div>
            <p className={homeTokens.categoryCards.eyebrow}>
              {t.home.disciplinesLabel}
            </p>
            <h2 className={homeTokens.categoryCards.heading}>
              {t.home.findYourSport}
            </h2>
          </div>
          <Link href="/shop" className={homeTokens.categoryCards.viewAllLink}>
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {large1 && (
          <div className={cn(homeTokens.categoryCards.largeGrid, large2 ? "grid-cols-2" : "grid-cols-1")}>
            <CategoryCard
              cat={large1}
              locale={locale}
              shopLabel={t.home.shopCollection}
              minHeight="min-h-[220px] md:min-h-[280px]"
            />
            {large2 && (
              <CategoryCard
                cat={large2}
                locale={locale}
                shopLabel={t.home.shopCollection}
                minHeight="min-h-[220px] md:min-h-[280px]"
              />
            )}
          </div>
        )}

        {small.length > 0 && (
          <div className={homeTokens.categoryCards.smallGrid}>
            {small.map((cat) => (
              <CategoryCard
                key={cat.slug}
                cat={cat}
                locale={locale}
                shopLabel={t.home.shopCollection}
                minHeight="min-h-[130px] md:min-h-[160px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  locale,
  shopLabel,
  minHeight,
}: {
  cat: DbCategory;
  locale: "en" | "ar";
  shopLabel: string;
  minHeight: string;
}) {
  const displayName = locale === "ar" && cat.nameAr ? cat.nameAr : cat.name;
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      aria-label={`Shop ${displayName}`}
      className={cn(homeTokens.categoryCards.card, minHeight)}
    >
      {cat.iconUrl ? (
        <>
          <img
            src={toCloudinaryUrl(cat.iconUrl)}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={homeTokens.categoryCards.cardOverlay} />
        </>
      ) : (
        <div className={homeTokens.categoryCards.cardFallback} />
      )}

      <div className={homeTokens.categoryCards.cardDot} />
      <div className="relative z-10">
        <p className={homeTokens.categoryCards.cardName}>{displayName}</p>
        <p className={homeTokens.categoryCards.cardShopLabel}>
          {shopLabel}
          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </p>
      </div>
    </Link>
  );
}
