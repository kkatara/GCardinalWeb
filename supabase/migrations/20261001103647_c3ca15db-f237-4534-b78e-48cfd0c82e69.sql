CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('project','program','opportunity','article','resource','team','partner','voice','report')),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 180),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category TEXT NOT NULL DEFAULT 'General',
  summary TEXT NOT NULL DEFAULT '' CHECK (char_length(summary) <= 600),
  body TEXT NOT NULL DEFAULT '' CHECK (char_length(body) <= 20000),
  location TEXT,
  organization TEXT,
  image_url TEXT,
  external_url TEXT,
  published_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published content is public" ON public.content_items FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all content" ON public.content_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create content" ON public.content_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update content" ON public.content_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete content" ON public.content_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.impact_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE CHECK (char_length(label) BETWEEN 2 AND 100),
  value NUMERIC NOT NULL DEFAULT 0 CHECK (value >= 0),
  unit TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.impact_statistics TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.impact_statistics TO authenticated;
GRANT ALL ON public.impact_statistics TO service_role;
ALTER TABLE public.impact_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active impact statistics are public" ON public.impact_statistics FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins manage impact statistics" ON public.impact_statistics FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type TEXT NOT NULL CHECK (submission_type IN ('member','volunteer','mentor','partner','contact','opportunity')),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  phone TEXT,
  country TEXT,
  county TEXT,
  age_range TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT,
  organization TEXT,
  message TEXT NOT NULL DEFAULT '' CHECK (char_length(message) <= 5000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','accepted','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can send submissions" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "Admins manage submissions" ON public.submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (char_length(email) <= 255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (is_active = true);
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_opportunities TO authenticated;
GRANT ALL ON public.saved_opportunities TO service_role;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own saved opportunities" ON public.saved_opportunities FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER content_items_updated BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER submissions_updated BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER impact_statistics_updated BEFORE UPDATE ON public.impact_statistics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.impact_statistics (label, value, unit, display_order) VALUES
('Young People Engaged', 12480, '+', 1), ('Communities Reached', 42, '', 2), ('Projects Implemented', 28, '', 3), ('Partnerships Built', 19, '', 4), ('Trees Planted', 18500, '+', 5), ('Litres of Water Saved', 3200000, '+', 6), ('Schools Reached', 36, '', 7), ('Trainings Conducted', 74, '', 8);

INSERT INTO public.content_items (content_type, title, slug, category, summary, body, location, organization, featured, status, published_at, deadline, details) VALUES
('project','Community Water Guardians','community-water-guardians','Water','Youth teams map water risks, improve harvesting systems and lead practical conservation work.','A community-led demonstration project connecting youth training with practical water conservation and local knowledge.','Machakos County','Green Cardinal KE',true,'published',now() - interval '60 days',null,'{"impact":"18 youth trained · 4 systems improved","sdgs":[6,13]}'),
('project','Green Schools Action Network','green-schools-action-network','Education','Students turn school grounds into living classrooms for climate action.','School clubs lead tree growing, waste reduction, water conservation and peer education.','Kiambu County','Green Cardinal KE',true,'published',now() - interval '45 days',null,'{"impact":"12 schools · 2,400 learners","sdgs":[4,12,13]}'),
('project','Youth Climate Digital Lab','youth-climate-digital-lab','Technology','Young innovators prototype accessible digital tools for environmental learning.','An innovation sprint supporting youth teams to move from community challenge to testable solution.','Nairobi & Online','Green Cardinal KE',true,'published',now() - interval '20 days',null,'{"impact":"8 prototypes · 31 innovators","sdgs":[9,13,17]}'),
('program','Youth Climate Leadership','youth-climate-leadership','Leadership','Training young people in climate leadership, advocacy and policy engagement.','A practical learning pathway combining climate literacy, organizing, communication and policy participation.','Kenya','Green Cardinal KE',true,'published',now(),null,'{}'),
('program','Water & Environmental Action','water-environmental-action','Water','Supporting youth and communities to implement practical conservation projects.','Hands-on local action backed by training, collaboration and shared evidence.','Kenya','Green Cardinal KE',true,'published',now(),null,'{}'),
('program','Green Schools','green-schools','Education','Environmental learning, tree growing, waste action and water stewardship in schools.','A student-centered program turning learning into visible school and community action.','Kenya','Green Cardinal KE',true,'published',now(),null,'{}'),
('program','Youth Innovation Lab','youth-innovation-lab','Technology','Supporting technology-enabled solutions to environmental and water challenges.','A platform for ideation, mentorship, prototyping and community testing.','Kenya & Online','Green Cardinal KE',false,'published',now(),null,'{}'),
('program','Climate Education','climate-education','Education','Making climate science, policy and opportunities accessible to young people.','Open learning materials and facilitated experiences designed for local relevance.','Kenya & Online','Green Cardinal KE',false,'published',now(),null,'{}'),
('opportunity','Green Climate Leaders Fellowship','green-climate-leaders-fellowship','Fellowships','A guided leadership experience for emerging youth climate organizers.','Demo opportunity for the Green Cardinal KE opportunities hub.','Nairobi / Hybrid','Green Cardinal KE',true,'published',now(),now() + interval '21 days','{"eligibility":"Ages 18–30; Kenya","format":"Hybrid"}'),
('opportunity','Water Innovation Micro-Grant','water-innovation-micro-grant','Grants','Seed support for youth-led water conservation ideas.','Demo opportunity for youth-led teams testing community water solutions.','Kenya','Green Cardinal KE',true,'published',now(),now() + interval '35 days','{"eligibility":"Youth-led teams","format":"Online application"}'),
('opportunity','School Climate Club Volunteers','school-climate-club-volunteers','Volunteering','Support environmental learning activities with participating schools.','Demo volunteer opportunity for facilitators and peer educators.','Kiambu County','Green Cardinal KE',false,'published',now(),now() + interval '50 days','{"eligibility":"Ages 18+","format":"In person"}'),
('article','Why youth leadership changes climate action','why-youth-leadership-changes-climate-action','Youth stories','Young people bring urgency, lived experience and fresh routes to action.','A demonstration story exploring meaningful youth participation beyond consultation.','Kenya','Green Cardinal KE',true,'published',now() - interval '4 days',null,'{}'),
('article','Water security starts with local knowledge','water-security-starts-with-local-knowledge','Water stories','Community insight is essential to solutions that last.','A demonstration field note from youth-led water work.','Machakos County','Green Cardinal KE',false,'published',now() - interval '12 days',null,'{}'),
('resource','Youth Climate Action Starter Guide','youth-climate-action-starter-guide','Guides','A practical starting point for planning a local youth climate action.','Demonstration downloadable guide with planning prompts, safeguarding notes and reflection tools.','Online','Green Cardinal KE',true,'published',now(),null,'{"format":"PDF","size":"2.4 MB"}'),
('resource','School Water Audit Toolkit','school-water-audit-toolkit','Toolkits','Simple activities for understanding and reducing school water use.','Demonstration toolkit for student clubs and teachers.','Online','Green Cardinal KE',true,'published',now(),null,'{"format":"PDF","size":"1.8 MB"}'),
('voice','Amina’s school garden story','amina-school-garden-story','Youth voices','Leading our environmental club showed me that small actions can change how a whole school thinks.','A demonstration youth voice profile.','Kisumu County','Green Cardinal KE',true,'published',now(),null,'{"name":"Amina N.","role":"Student climate leader"}'),
('partner','Community Partner Placeholder','community-partner-placeholder','Community Partners','Partner identity to be confirmed by Green Cardinal KE.','Demonstration partner entry.','Kenya',null,false,'published',now(),null,'{}'),
('report','Annual Impact Snapshot 2026','annual-impact-snapshot-2026','Reports','A demonstration report entry ready to be replaced with the official annual publication.','Impact highlights and learning from Green Cardinal KE initiatives.','Kenya','Green Cardinal KE',true,'published',now(),null,'{"format":"PDF","year":"2026"}');