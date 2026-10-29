import { User } from '../../core/models/User';

/** Demo developers. Safe to run twice: upserts by username. */
const demo = [
  { username: 'ada', displayName: 'Ada Byte', character: 'ember', bio: 'Compilers, coffee, and tiny CLIs.', techStack: ['rust', 'typescript'] },
  { username: 'lin', displayName: 'Lin Mercer', character: 'rose', bio: 'Backend by day, game jams by night.', techStack: ['go', 'postgres', 'redis'] },
  { username: 'kai', displayName: 'Kai Okafor', character: 'jax', bio: 'Shipping a side project a month.', techStack: ['next.js', 'tailwind', 'mongodb'] },
  { username: 'mira', displayName: 'Mira Soto', character: 'plum', bio: 'Learning ML by breaking things.', techStack: ['python', 'pytorch'] },
  { username: 'ravi', displayName: 'Ravi Nair', character: 'bruno', bio: 'DevOps. I read the logs so you do not have to.', techStack: ['docker', 'kubernetes', 'bash'] },
] as const;

export async function seedProfiles() {
  for (const [i, u] of demo.entries()) {
    await User.updateOne(
      { username: u.username },
      { $set: { ...u, techStack: [...u.techStack] }, $setOnInsert: { githubId: `seed-${i + 1}` } },
      { upsert: true },
    );
  }
  console.log(`[profiles] seeded ${demo.length} demo users`);
}
