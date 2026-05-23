export type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
  user: { name: string; image: string | null };
};

export interface ReviewsListProps {
  reviews: Review[];
}
