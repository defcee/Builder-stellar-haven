ALTER TABLE users
  ADD COLUMN preferred_currency CHAR(3) NOT NULL DEFAULT 'NGN'
    CHECK (preferred_currency ~ '^[A-Z]{3}$');

CREATE TABLE user_locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label           TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 80),
  recipient_name  TEXT CHECK (char_length(recipient_name) <= 120),
  address_line_1  TEXT NOT NULL CHECK (char_length(address_line_1) BETWEEN 1 AND 200),
  address_line_2  TEXT CHECK (char_length(address_line_2) <= 200),
  city            TEXT NOT NULL CHECK (char_length(city) BETWEEN 1 AND 100),
  region          TEXT CHECK (char_length(region) <= 100),
  postal_code     TEXT CHECK (char_length(postal_code) <= 20),
  country_code    CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  latitude        NUMERIC(9, 6) CHECK (latitude BETWEEN -90 AND 90),
  longitude       NUMERIC(9, 6) CHECK (longitude BETWEEN -180 AND 180),
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX user_locations_user_idx ON user_locations (user_id);
CREATE UNIQUE INDEX user_locations_one_default_idx ON user_locations (user_id) WHERE is_default;

CREATE TABLE orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id             UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  seller_id            UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  shipping_location_id UUID REFERENCES user_locations (id) ON DELETE SET NULL,
  shipping_address     JSONB,
  status               TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled')),
  payment_status       TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  currency_code        CHAR(3) NOT NULL CHECK (currency_code ~ '^[A-Z]{3}$'),
  subtotal             NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
  total                NUMERIC(14, 2) NOT NULL CHECK (total >= 0),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (buyer_id <> seller_id)
);
CREATE INDEX orders_buyer_created_idx ON orders (buyer_id, created_at DESC);
CREATE INDEX orders_seller_created_idx ON orders (seller_id, created_at DESC);
CREATE INDEX orders_status_created_idx ON orders (status, created_at DESC);

CREATE TABLE order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  listing_id            UUID REFERENCES listings (id) ON DELETE SET NULL,
  listing_title         TEXT NOT NULL CHECK (char_length(listing_title) BETWEEN 1 AND 160),
  quantity              INTEGER NOT NULL CHECK (quantity > 0),
  unit_price            NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
  line_total            NUMERIC(14, 2) NOT NULL CHECK (line_total >= 0 AND line_total = unit_price * quantity),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_idx ON order_items (order_id);
CREATE INDEX order_items_listing_idx ON order_items (listing_id);

CREATE TRIGGER user_locations_set_updated_at BEFORE UPDATE ON user_locations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
