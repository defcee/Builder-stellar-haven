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

CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id            UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  payee_business_id   UUID REFERENCES business_profiles (id) ON DELETE SET NULL,
  listing_id          UUID REFERENCES listings (id) ON DELETE SET NULL,
  amount              NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  currency_code       CHAR(3) NOT NULL CHECK (currency_code ~ '^[A-Z]{3}$'),
  provider            TEXT NOT NULL CHECK (char_length(provider) BETWEEN 2 AND 40),
  provider_reference  TEXT NOT NULL UNIQUE CHECK (char_length(provider_reference) BETWEEN 1 AND 200),
  status              TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status <> 'succeeded' OR paid_at IS NOT NULL)
);
CREATE INDEX payments_payer_idx ON payments (payer_id, created_at DESC);
CREATE INDEX payments_payee_idx ON payments (payee_business_id, status);
CREATE INDEX payments_listing_idx ON payments (listing_id);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['social_campaigns', 'payments'] LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t || '_set_updated_at', t
    );
  END LOOP;
END $$;
