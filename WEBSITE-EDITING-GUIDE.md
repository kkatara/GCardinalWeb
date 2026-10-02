# Green Cardinal KE Website Editing Guide

A practical map of where to change each part of the website. The site is built with React, TanStack file-based routes, Tailwind CSS, and Supabase.

## Quick Starting Point

- To change a page's layout, headings, or fixed wording, edit its file in `src/routes/`.
- To change the shared logo, navigation, footer, or newsletter signup, edit `src/components/site/`.
- To manage published projects, opportunities, articles, resources, and impact figures, sign in at `/auth` and use `/admin`.
- To change colors, fonts, spacing utilities, or global styles, edit `src/styles.css`.
- To replace a bundled photo, add the image to `src/assets/` and update the import/use in the page or component that displays it.

## Website Pages

| Website section | Route | Main file | What to edit there |
| --- | --- | --- | --- |
| Home | `/` | [`src/routes/index.tsx`](src/routes/index.tsx) | Hero title and wording, home section headings, focus-area display, and layout. The hero photo is imported from `src/assets/index-image.jpg`. Featured projects, opportunities, stories, youth quote, and impact figures are loaded from Supabase. |
| About Us | `/about` | [`src/routes/about.tsx`](src/routes/about.tsx) | Intro, organization description, vision, mission, values, and team placeholder text. The page photo is `src/assets/green-cardinal-youth-action.jpg`. Team cards are currently placeholders, not connected to admin team records. |
| Our Work | `/work` | [`src/routes/work.tsx`](src/routes/work.tsx) | Intro and project category filters. Project cards come from published project records in Supabase. |
| Programs | `/programs` | [`src/routes/programs.tsx`](src/routes/programs.tsx) and [`src/lib/site-data.ts`](src/lib/site-data.ts) | Intro and program cards. Program names, categories, and descriptions are the `programs` list in `site-data.ts`; this public page is currently hard-coded. |
| Opportunities | `/opportunities` | [`src/routes/opportunities.tsx`](src/routes/opportunities.tsx) | Intro, search/filter controls, and submit-opportunity form. Published opportunity cards come from Supabase. The category filter choices are fixed in this file. |
| Impact | `/impact` | [`src/routes/impact.tsx`](src/routes/impact.tsx) | Intro, map presentation, location pins, and report download link. Impact statistic values are loaded from Supabase; the map locations and their positions are fixed in this file. The current report file is under `public/reports/`. |
| Resources | `/resources` | [`src/routes/resources.tsx`](src/routes/resources.tsx) | Intro, search behavior, and resource-card layout. Published resources, reports, and articles are loaded from Supabase. |
| Get Involved | `/get-involved` | [`src/routes/get-involved.tsx`](src/routes/get-involved.tsx) | Intro, membership/volunteer/mentor/partner choices, and donation placeholder. The selected choice determines the type of submission. |
| Partners | `/partners` | [`src/routes/partners.tsx`](src/routes/partners.tsx) | Intro and partner-category cards. This public page currently shows fixed categories; it does not display partner records managed in admin. |
| Contact | `/contact` | [`src/routes/contact.tsx`](src/routes/contact.tsx) | Intro, email/location/social contact details, map placeholder, and contact form placement. |
| Staff sign-in | `/auth` | [`src/routes/auth.tsx`](src/routes/auth.tsx) | Sign-in wording and login behavior. Authentication settings are also in `src/integrations/`. |
| Access restricted | `/unauthorized` | [`src/routes/unauthorized.tsx`](src/routes/unauthorized.tsx) | Message shown to signed-in accounts without the admin role. |
| Admin dashboard | `/admin` | [`src/routes/_authenticated/admin.tsx`](src/routes/_authenticated/admin.tsx) | Admin navigation, content forms, impact editor, and application status controls. Access is restricted to authorized admins. |

## Shared Site Parts

- **Brand name and logo:** [`src/components/site/Brand.tsx`](src/components/site/Brand.tsx). The current image is `src/assets/logo.jpg`; the subtitle and displayed brand name are in this component. It appears in shared site branding, including the header, footer, and sign-in page.
- **Header navigation and footer:** [`src/components/site/SiteShell.tsx`](src/components/site/SiteShell.tsx). Edit the `links` list for navigation; update the footer description, links, social buttons, or newsletter form here. Social links currently use placeholder `#` URLs.
- **Reusable page headings and call to action:** [`src/components/site/Page.tsx`](src/components/site/Page.tsx). `PageIntro`, `SectionHeading`, and `MovementCta` are shared by multiple pages. Change them here to affect every page that uses them.
- **Project/article/opportunity cards:** [`src/components/site/ContentCard.tsx`](src/components/site/ContentCard.tsx). Controls card fields and display. A supplied `image_url` is used when present; otherwise Water cards use the water photo and other card images fall back to the school photo.
- **Public forms:** [`src/components/site/SubmitForm.tsx`](src/components/site/SubmitForm.tsx). Changes the shared contact, membership, volunteer, mentor, partner, and opportunity submission form and validation.
- **Global application wrapper:** [`src/routes/__root.tsx`](src/routes/__root.tsx). Controls the header/footer placement, global metadata, font loading, error page, and route outlet. Keep `<Outlet />`; child pages render there.

## Admin-Managed Content

Sign in at `/auth`, then open `/admin`. The dashboard reads and writes Supabase records; public pages only show published content.

- **Projects:** Admin > Projects. Publicly shown on Home and Our Work.
- **Opportunities:** Admin > Opportunities. Publicly shown on Home and Opportunities.
- **Articles:** Admin > Articles. Publicly shown as stories on Home and included in Resources.
- **Resources:** Admin > Resources. Publicly shown on Resources.
- **Impact numbers:** Admin > Impact. Update label, value, unit, display order, and active status. The Home and Impact pages use active statistics; demo values in `src/lib/site-data.ts` are a fallback if Supabase has no active records.
- **Applications/submissions:** Admin > Applications. Contact, membership, volunteer, mentor, partner, and opportunity forms save here. Admin can update each status.
- **Newsletter subscribers:** The footer signup saves email addresses to Supabase. The dashboard overview shows the active-subscriber count, but there is currently no subscriber-management tab.

Content forms include title, URL slug, category, location, organization, deadline, image URL, external URL, summary, body, status, and featured. **Image URL is a text field, not a file picker.** Upload/store an image separately and enter its public URL; for an image bundled with the website, place it in `src/assets/` and reference it from code.

## Areas That Still Require Code Changes

- The Programs page reads the local `programs` list in `src/lib/site-data.ts`; it is not managed from the dashboard.
- The About page's team section is placeholder content. Although Admin has a Team list, the About page does not currently fetch those records.
- The Partners page shows hard-coded category cards. Although Admin has a Partners list, those records are not currently rendered there.
- The Impact map pins and coordinates, contact details, category-filter options, social URLs, donation details, and annual report link are fixed in route/component code.
- The Home page uses the first published voice entry, but the dashboard has no Voice editor tab. To update that quote, an admin-only data tool or a code change to add a Voice editor is needed.
- Reports are displayed by Resources, but the dashboard's Resources editor creates `resource` records only. The impact report download link itself points to a file in `public/reports/` and is maintained in code.

## Images and Styling

- Website-imported images: [`src/assets/`](src/assets/). Current images include the logo, home hero, About photo, water project photo, and school project photo.
- Public files served by their URL path: [`public/`](public/). Reports are in `public/reports/`; for example, files there are linked as `/reports/filename.pdf`.
- Shared colors, fonts, responsive utility classes, and motion: [`src/styles.css`](src/styles.css). Prefer changing its existing CSS variables/utilities so the design stays consistent.
- Reusable basic controls: `src/components/ui/` (buttons, inputs, dialogs, tables, and other UI building blocks).

## Project and Data Files

- [`src/lib/site-data.ts`](src/lib/site-data.ts): shared TypeScript types, fixed program/focus-area content, and fallback demo impact values.
- [`src/lib/content.ts`](src/lib/content.ts): loads published content and active impact figures from Supabase. Change this when changing how public pages query content.
- [`src/lib/admin.functions.ts`](src/lib/admin.functions.ts): server-side admin reads/writes, validation, and role checks. Change this when altering dashboard data operations; preserve the authorization checks.
- `src/integrations/supabase/`: Supabase client, authentication, and generated database types.
- `supabase/migrations/`: database tables, access rules, and initial sample records. Migrations change the database schema/data; do not edit one casually after it has already been applied.
- `src/routes/README.md`: file-based route conventions. `src/routeTree.gen.ts` is generated; do not edit it by hand.
- `src/router.tsx`, `src/server.ts`, and `src/start.ts`: router and application startup/server wiring. These are not the usual place to edit page text.
- `package.json`: available commands and project dependencies. Common commands are `npm run dev` (local website), `npm run build` (production build), and `npm run preview` (preview build).
- `AGENTS.md`: project-specific development notes. `README.md`: setup and development instructions. `roadmap.md`: project roadmap.

## Safe Editing Routine

1. Find the page or shared component in the tables above.
2. For database-managed records, use the admin dashboard instead of changing seed/migration files.
3. Run `npm run dev` and open the local URL shown in the terminal.
4. Check the affected page at desktop and mobile widths.
5. Run `npm run build` before publishing.
