CREATE TABLE IF NOT EXISTS public.courts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  location VARCHAR(255) NOT NULL
);

ALTER TABLE ONLY public.courts DROP CONSTRAINT IF EXISTS courts_pkey;
ALTER TABLE ONLY public.courts ADD CONSTRAINT courts_pkey PRIMARY KEY (id);

CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  court_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  time VARCHAR(255)[] NOT NULL
);

ALTER TABLE ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey CASCADE;
ALTER TABLE ONLY public.events ADD CONSTRAINT events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.events DROP CONSTRAINT IF EXISTS fk_courts_events CASCADE;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_courts_events FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

ALTER TABLE ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  refresh_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_pkey CASCADE;
ALTER TABLE ONLY public.user_sessions ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT IF EXISTS fk_users_user_sessions;
ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT fk_users_user_sessions FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
