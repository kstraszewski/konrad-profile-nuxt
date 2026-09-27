-- Run only in the isolated oferteo_demo database. No existing application tables are touched.
CREATE TABLE IF NOT EXISTS oferteo_contractors (
  id text PRIMARY KEY,
  name text NOT NULL,
  city text NOT NULL,
  category text NOT NULL,
  profile jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT oferteo_profile_id_matches CHECK (profile->>'id' = id),
  CONSTRAINT oferteo_profile_city_matches CHECK (profile->>'city' = city),
  CONSTRAINT oferteo_profile_category_matches CHECK (profile->>'category' = category)
);
CREATE INDEX IF NOT EXISTS oferteo_contractors_city_category_idx ON oferteo_contractors (city, category);

CREATE TABLE IF NOT EXISTS oferteo_rate_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL DEFAULT 1 CHECK (hits >= 0),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS oferteo_rate_limits_expiry_idx ON oferteo_rate_limits (expires_at);
