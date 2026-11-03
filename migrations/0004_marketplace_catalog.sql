CREATE INDEX sessions_active_expiry_idx ON sessions (expires_at) WHERE revoked_at IS NULL;

INSERT INTO categories (name, slug, description) VALUES
  ('Fresh produce', 'fresh-produce', 'Fresh fruits, vegetables, and farm produce.'),
  ('Grains and staples', 'grains-staples', 'Grains, pulses, roots, and everyday food staples.'),
  ('Livestock and poultry', 'livestock-poultry', 'Livestock, poultry, eggs, and related products.'),
  ('Farm supplies', 'farm-supplies', 'Tools, equipment, seeds, and agricultural supplies.'),
  ('Food and beverages', 'food-beverages', 'Packaged foods, prepared goods, and beverages.'),
  ('Home and personal care', 'home-personal-care', 'Household goods and personal care products.'),
  ('Professional services', 'professional-services', 'Business, repair, logistics, and other local services.')
ON CONFLICT (slug) DO NOTHING;