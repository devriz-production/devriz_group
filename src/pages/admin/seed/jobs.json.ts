// Starter list of openings. The server copies it once, the first time the jobs
// feed is read. After that, openings are managed in the admin panel.
import { roles } from '../../../data/careers';

export function GET() {
  const seed = roles.map((r) => ({
    title: r.title,
    department: r.department,
    type: r.type ?? 'Full-time',
    experience: r.experience ?? '',
    location: r.location ?? '',
    summary: r.summary,
    points: r.points,
    fit: r.fit ?? '',
  }));
  return new Response(JSON.stringify(seed), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
