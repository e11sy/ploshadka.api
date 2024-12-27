--
-- Name: courts; Type: TABLE; Schema: public;
--
CREATE TABLE IF NOT EXISTS public.courts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  location VARCHAR(255) NOT NULL
);

--
-- Name: courts courts_pkey; Type: CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.courts DROP CONSTRAINT IF EXISTS courts_pkey;
ALTER TABLE ONLY public.courts ADD CONSTRAINT courts_pkey PRIMARY KEY (id);

--
-- Name: events; Type: TABLE; Schema: public;
--
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  court_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  sport VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  people_limit INTEGER NOT NULL,
  expires_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '1 day'
);

--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey CASCADE;
ALTER TABLE ONLY public.events ADD CONSTRAINT events_pkey PRIMARY KEY (id);

--
-- Name: events events_court_id_fkey; Type: FK CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.events DROP CONSTRAINT IF EXISTS fk_courts_events CASCADE;
ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_court_id_fkey FOREIGN KEY (court_id) REFERENCES public.courts(id) ON DELETE CASCADE;

--
-- Name: users; Type: TABLE; Schema: public;
--
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: user_sessions; Type: TABLE; Schema: public;
--
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  refresh_token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_pkey CASCADE;
ALTER TABLE ONLY public.user_sessions ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);

--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: event_visits; Type: TABLE; Schema: public;
--
CREATE TABLE IF NOT EXISTS public.event_visits (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL
);

--
-- Name: event_visits event_visits_pkey; Type: CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.event_visits DROP CONSTRAINT IF EXISTS event_visits_pkey CASCADE;
ALTER TABLE ONLY public.event_visits ADD CONSTRAINT event_visits_pkey PRIMARY KEY (id);

--
-- Name: event_visits event_visits_event_id_fk; Type: FK CONSTRAINT; Schema: public;
--
ALTER TABLE ONLY public.event_visits DROP CONSTRAINT IF EXISTS event_visits_event_id_fk;
ALTER TABLE ONLY public.event_visits
    ADD CONSTRAINT event_visits_event_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

--
-- Name: event_visits event_visits_user_id_fkey; Type: FK CONSTRAINT; Schema: public;
ALTER TABLE ONLY public.event_visits DROP CONSTRAINT IF EXISTS event_visits_user_id_fkey;
ALTER TABLE ONLY public.event_visits
    ADD CONSTRAINT event_visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
