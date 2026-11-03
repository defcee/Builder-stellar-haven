ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS category_label TEXT
    CHECK (category_label IS NULL OR char_length(category_label) <= 100);

CREATE INDEX IF NOT EXISTS conversations_listing_creator_idx
  ON conversations (listing_id, created_by_user_id)
  WHERE listing_id IS NOT NULL;
