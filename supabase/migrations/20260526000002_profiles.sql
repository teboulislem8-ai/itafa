CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL UNIQUE,
  wilaya_code INTEGER NOT NULL REFERENCES wilayas(code),
  specialization TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'fr' CHECK (language IN ('ar', 'fr', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE INDEX idx_profiles_nickname ON profiles(nickname);
CREATE INDEX idx_profiles_wilaya_code ON profiles(wilaya_code);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, nickname, wilaya_code, specialization, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'wilaya_code')::INTEGER, 16),
    COALESCE(NEW.raw_user_meta_data ->> 'specialization', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'fr')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
