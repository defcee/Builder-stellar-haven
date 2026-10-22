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

CREATE TRIGGER social_campaigns_set_updated_at BEFORE UPDATE ON social_campaigns
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
