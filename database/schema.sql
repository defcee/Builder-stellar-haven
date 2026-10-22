-- BizzLeap SME full schema for a fresh PostgreSQL / Neon database.
-- Equivalent to running migrations/0001, 0002 and 0003 in order.
-- Use either this file or the migration runner on an empty database, not both.

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name          TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email              TEXT NOT NULL CHECK (email = lower(email) AND char_length(email) <= 254),
  password_hash      TEXT NOT NULL,
  role               TEXT NOT NULL CHECK (role IN ('farmer', 'business', 'buyer', 'admin')),
  country_code       CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  preferred_language TEXT NOT NULL DEFAULT 'en',
  phone              TEXT CHECK (phone IS NULL OR char_length(phone) BETWEEN 7 AND 20),
  avatar_url         TEXT,
  email_verified_at  TIMESTAMPTZ,
  last_login_at      TIMESTAMPTZ,
  account_status     TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_key ON users (email);
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_created_at_idx ON users (created_at DESC);

CREATE TABLE sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  expires_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON sessions (user_id);

CREATE TABLE email_verification_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX email_verification_tokens_user_id_idx ON email_verification_tokens (user_id);

CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX password_reset_tokens_user_id_idx ON password_reset_tokens (user_id);

CREATE TABLE farmer_profiles (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  farm_name                   TEXT NOT NULL CHECK (char_length(farm_name) BETWEEN 2 AND 120),
  description                 TEXT CHECK (char_length(description) <= 2000),
  country_code                CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  region                      TEXT,
  city                        TEXT,
  public_contact_preferences  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  slug         TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description  TEXT CHECK (char_length(description) <= 1000),
  image_url    TEXT,
  parent_id    UUID REFERENCES categories (id) ON DELETE SET NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (parent_id IS NULL OR parent_id <> id)
);
CREATE INDEX categories_parent_id_idx ON categories (parent_id);
CREATE INDEX categories_active_idx ON categories (is_active);

CREATE TABLE business_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  business_name       TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 2 AND 120),
  slug                TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  business_type       TEXT,
  category_id         UUID REFERENCES categories (id) ON DELETE SET NULL,
  description         TEXT CHECK (char_length(description) <= 4000),
  logo_url            TEXT,
  cover_image_url     TEXT,
  country_code        CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  region              TEXT,
  city                TEXT,
  public_email        TEXT,
  public_phone        TEXT,
  website_url         TEXT,
  social_links        JSONB NOT NULL DEFAULT '{}'::jsonb,
  operating_hours     JSONB,
  publication_status  TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX business_profiles_category_idx ON business_profiles (category_id);
CREATE INDEX business_profiles_public_idx ON business_profiles (publication_status, country_code, region, city);

CREATE TABLE listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  business_id         UUID REFERENCES business_profiles (id) ON DELETE SET NULL,
  category_id         UUID REFERENCES categories (id) ON DELETE SET NULL,
  title               TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  slug                TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description         TEXT CHECK (char_length(description) <= 5000),
  listing_type        TEXT NOT NULL CHECK (listing_type IN ('product', 'service')),
  price               NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  currency_code       CHAR(3) NOT NULL CHECK (currency_code ~ '^[A-Z]{3}$'),
  unit                TEXT CHECK (char_length(unit) <= 40),
  stock_quantity      INTEGER CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  availability_status TEXT NOT NULL DEFAULT 'available'
    CHECK (availability_status IN ('available', 'limited', 'unavailable')),
  country_code        CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  region              TEXT,
  city                TEXT,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  publication_status  TEXT NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
  rejection_reason    TEXT,
  published_at        TIMESTAMPTZ,
  search_vector       TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) STORED,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (publication_status <> 'published' OR published_at IS NOT NULL)
);
CREATE INDEX listings_owner_id_idx ON listings (owner_id);
CREATE INDEX listings_business_id_idx ON listings (business_id);
CREATE INDEX listings_category_idx ON listings (category_id);
CREATE INDEX listings_public_feed_idx ON listings (publication_status, published_at DESC);
CREATE INDEX listings_price_idx ON listings (publication_status, price);
CREATE INDEX listings_location_idx ON listings (publication_status, country_code, region, city);
CREATE INDEX listings_search_idx ON listings USING GIN (search_vector);
CREATE INDEX listings_tags_idx ON listings USING GIN (tags);

CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  alt_text    TEXT CHECK (char_length(alt_text) <= 240),
  sort_order  INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  width       INTEGER CHECK (width IS NULL OR width > 0),
  height      INTEGER CHECK (height IS NULL OR height > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX listing_images_listing_idx ON listing_images (listing_id, sort_order);

CREATE TABLE conversations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  listing_id          UUID REFERENCES listings (id) ON DELETE SET NULL,
  business_id         UUID REFERENCES business_profiles (id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX conversations_creator_idx ON conversations (created_by_user_id);

CREATE TABLE conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  last_read_at    TIMESTAMPTZ,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX conversation_participants_user_idx ON conversation_participants (user_id);

CREATE TABLE messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  sender_id        UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  message_body     TEXT NOT NULL CHECK (char_length(message_body) BETWEEN 1 AND 5000),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);
CREATE INDEX messages_conversation_idx ON messages (conversation_id, created_at);
CREATE INDEX messages_sender_idx ON messages (sender_id);

CREATE TABLE saved_listings (
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES listings (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
CREATE INDEX saved_listings_listing_idx ON saved_listings (listing_id);

CREATE TABLE saved_businesses (
  user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  business_id  UUID NOT NULL REFERENCES business_profiles (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, business_id)
);
CREATE INDEX saved_businesses_business_idx ON saved_businesses (business_id);

CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  business_id         UUID REFERENCES business_profiles (id) ON DELETE CASCADE,
  listing_id          UUID REFERENCES listings (id) ON DELETE CASCADE,
  rating              SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text         TEXT CHECK (char_length(review_text) <= 2000),
  moderation_status   TEXT NOT NULL DEFAULT 'approved'
    CHECK (moderation_status IN ('pending', 'approved', 'hidden')),
  seller_response     TEXT CHECK (char_length(seller_response) <= 1000),
  seller_responded_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(business_id, listing_id) = 1)
);
CREATE UNIQUE INDEX reviews_one_per_business_key ON reviews (reviewer_id, business_id) WHERE business_id IS NOT NULL;
CREATE UNIQUE INDEX reviews_one_per_listing_key ON reviews (reviewer_id, listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX reviews_business_public_idx ON reviews (business_id, moderation_status, created_at DESC);
CREATE INDEX reviews_listing_public_idx ON reviews (listing_id, moderation_status, created_at DESC);

CREATE TABLE notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title             TEXT NOT NULL CHECK (char_length(title) <= 200),
  body              TEXT CHECK (char_length(body) <= 1000),
  destination_path  TEXT CHECK (destination_path IS NULL OR destination_path LIKE '/%'),
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON notifications (user_id, read_at, created_at DESC);

CREATE TABLE reports (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id        UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  reported_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
  listing_id         UUID REFERENCES listings (id) ON DELETE SET NULL,
  business_id        UUID REFERENCES business_profiles (id) ON DELETE SET NULL,
  review_id          UUID REFERENCES reviews (id) ON DELETE SET NULL,
  reason             TEXT NOT NULL CHECK (char_length(reason) BETWEEN 2 AND 120),
  details            TEXT CHECK (char_length(details) <= 2000),
  status             TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_review', 'resolved', 'dismissed')),
  assigned_admin_id  UUID REFERENCES users (id) ON DELETE SET NULL,
  resolution_notes   TEXT CHECK (char_length(resolution_notes) <= 2000),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at        TIMESTAMPTZ,
  CHECK (num_nonnulls(reported_user_id, listing_id, business_id, review_id) >= 1)
);
CREATE INDEX reports_status_idx ON reports (status, created_at);
CREATE INDEX reports_reporter_idx ON reports (reporter_id);

CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email       TEXT NOT NULL CHECK (char_length(email) <= 254),
  subject     TEXT NOT NULL CHECK (char_length(subject) BETWEEN 3 AND 160),
  message     TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX contact_messages_status_idx ON contact_messages (status, created_at DESC);

CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   UUID REFERENCES users (id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON audit_logs (created_at DESC);
CREATE INDEX audit_logs_actor_idx ON audit_logs (actor_user_id, created_at DESC);
CREATE INDEX audit_logs_resource_idx ON audit_logs (resource_type, resource_id);

CREATE TABLE platform_settings (
  key         TEXT PRIMARY KEY CHECK (char_length(key) <= 100),
  value       JSONB NOT NULL,
  updated_by  UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_campaigns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  business_id   UUID REFERENCES business_profiles (id) ON DELETE SET NULL,
  listing_id    UUID REFERENCES listings (id) ON DELETE SET NULL,
  title         TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  body          TEXT CHECK (char_length(body) <= 2000),
  channels      TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(channels) >= 1),
  status        TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'published', 'cancelled')),
  scheduled_at  TIMESTAMPTZ,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status <> 'scheduled' OR scheduled_at IS NOT NULL),
  CHECK (status <> 'published' OR published_at IS NOT NULL)
);
CREATE INDEX social_campaigns_owner_idx ON social_campaigns (owner_id, created_at DESC);
CREATE INDEX social_campaigns_business_idx ON social_campaigns (business_id);
CREATE INDEX social_campaigns_listing_idx ON social_campaigns (listing_id);
CREATE INDEX social_campaigns_schedule_idx ON social_campaigns (status, scheduled_at);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'sessions', 'email_verification_tokens', 'password_reset_tokens',
    'farmer_profiles', 'categories', 'business_profiles', 'listings', 'listing_images',
    'conversations', 'messages', 'reviews', 'notifications', 'reports',
    'contact_messages', 'platform_settings', 'social_campaigns'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t
    );
  END LOOP;
END $$;
