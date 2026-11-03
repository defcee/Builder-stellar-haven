export interface MarketplaceListing {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  description: string | null;
  listing_type: "product" | "service";
  price: string;
  currency_code: string;
  unit: string | null;
  availability_status: "available" | "limited" | "unavailable";
  region: string | null;
  city: string | null;
  image_url: string | null;
  alt_text: string | null;
  seller_name: string;
  business_name: string | null;
  business_slug: string | null;
  public_email: string | null;
  public_phone: string | null;
  category_id: string | null;
  category_name: string | null;
  product_type: string | null;
  category_label: string | null;
}