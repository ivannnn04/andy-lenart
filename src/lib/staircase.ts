/**
 * The Staircase — the wall where owners of every piece leave a thought.
 * `no` is the number of the garment its author owns.
 */
export type Mark = { id: string; text: string; name: string; city: string; no: string };

export const MAX_MARK_LENGTH = 240;

// The marks from the design, until the wall has a database behind it.
export const SEED_MARKS: Mark[] = [
  { id: "s1", text: "my mother was a waitress too.", name: "L.", city: "Lisbon", no: "04" },
  { id: "s2", text: "concrete remembers more than we do", name: "—", city: "Riga", no: "01" },
  { id: "s3", text: "13/22", name: "anon", city: "Brno", no: "01" },
  { id: "s4", text: "heard the track on the night bus.", name: "tomas", city: "London", no: "02" },
  { id: "s5", text: "never been to one. now I have.", name: "jj", city: "Berlin", no: "03" },
  { id: "s6", text: "I wore it to my grandmother's flat for the last time.", name: "mira", city: "Kraków", no: "03" },
  { id: "s7", text: "walls too thin — I could hear the neighbours argue and", name: "sofi", city: "Tallinn", no: "02" },
];
