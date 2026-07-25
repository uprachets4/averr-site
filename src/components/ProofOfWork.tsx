import { motion } from 'framer-motion';
import Slider from './Slider';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const siftSlides = [
  { src: '/work/sift/01-dashboard.jpg', alt: 'SIFT dashboard — three interviews this week, and Mercury just offered', caption: 'Dashboard — three interviews this week, and Mercury just offered' },
  { src: '/work/sift/02-tailor-resume.jpg', alt: 'SIFT AI resume tailoring, ATS score improving from 40 to 87', caption: 'Tailored resume — ATS score jumps from 40 to 87' },
  { src: '/work/sift/03-cover-letter.jpg', alt: 'SIFT AI-scored cover letter', caption: 'Cover letter — AI-scored 88, with quantified feedback' },
  { src: '/work/sift/04-pipeline.jpg', alt: 'SIFT pipeline board', caption: 'Pipeline board — 42 active applications, one offer pending' },
  { src: '/work/sift/05-outreach.jpg', alt: 'SIFT outreach inbox', caption: 'Outreach inbox — a real reply from a VP of Engineering at Stripe' },
  { src: '/work/sift/06-funnel.jpg', alt: 'SIFT funnel insights', caption: 'Funnel insights — stage conversion, velocity, hot roles ranked by fit' },
  { src: '/work/sift/07-sources.jpg', alt: 'SIFT source aggregation setup', caption: 'Source setup — LinkedIn, Y Combinator, Wellfound and more, one feed' },
];

const cgSlides = [
  { src: '/work/cgwalls/hero.jpg', alt: 'CG Walls & Floors homepage hero', caption: 'Rent-ready and buyer-ready, on your timeline' },
  { src: '/work/cgwalls/gallery.jpg', alt: 'CG Walls & Floors before and after gallery', caption: 'Real basements and rooms, framed to finished' },
  { src: '/work/cgwalls/gallery2.jpg', alt: 'CG Walls & Floors kitchen and bathroom transformations', caption: 'Full kitchen and bathroom transformations' },
  { src: '/work/cgwalls/testimonials.jpg', alt: 'CG Walls & Floors client reviews, 4.8 rating', caption: 'Real clients, real names — 4.8 average across Google reviews' },
];

function Showcase({
  tag,
  logo,
  name,
  description,
  stats,
  slides,
}: {
  tag: string;
  logo: string;
  name: string;
  description: string;
  stats: { num: string; label: string }[];
  slides: typeof siftSlides;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[20px] p-8 md:p-12 mb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
        <div className="max-w-[640px]">
          <span className="inline-block text-[11.5px] tracking-[0.06em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] px-2.5 py-1 rounded-full">
            {tag}
          </span>
          <div className="flex items-center gap-3 mt-3">
            <img src={logo} alt={`${name} logo`} className="w-9 h-9 rounded-lg object-cover" />
            <h3 className="font-display font-bold text-[clamp(28px,3.4vw,42px)] tracking-[-0.02em]">
              {name}
            </h3>
          </div>
          <p className="text-[var(--text-muted)] mt-3">{description}</p>
        </div>
        <div className="flex gap-8 flex-shrink-0">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-[var(--accent)]">{s.num}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Slider slides={slides} />
    </motion.div>
  );
}

function SecondaryCard({
  tag,
  logo,
  name,
  description,
  delay,
}: {
  tag: string;
  logo?: string;
  name: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-8 hover:border-[rgba(176,141,87,0.4)] transition-colors duration-300"
    >
      <span className="inline-block text-[11.5px] tracking-[0.06em] uppercase text-[var(--accent)] bg-[var(--accent-dim)] px-2.5 py-1 rounded-full">
        {tag}
      </span>
      <div className="flex items-center gap-3 mt-4 mb-3">
        {logo && <img src={logo} alt={`${name} logo`} className="w-8 h-8 rounded-lg object-cover" />}
        <h3 className="font-display font-bold text-2xl">{name}</h3>
      </div>
      <p className="text-[var(--text-muted)] text-[15px] leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function ProofOfWork() {
  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[640px] mb-16"
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            Proof of Work
          </div>
          <h2 className="font-display font-bold text-[clamp(28px,3.4vw,38px)] tracking-[-0.01em] leading-[1.15]">
            Not case studies. Live systems.
          </h2>
          <p className="text-[var(--text-muted)] mt-4">
            What I'm building right now, one business I co-founded, and one AI workflow
            already running in production — for students, not slides.
          </p>
        </motion.div>

        <Showcase
          tag="In Build"
          logo="/logos/sift.png"
          name="SIFT"
          description="One inbox for every job board — YC, LinkedIn, Google Jobs, Indeed. An agent scores your resume against the role, rewrites it to beat the ATS, finds the right people to message, and tracks the whole pipeline through to an offer."
          stats={[
            { num: '1', label: 'Offer received (Mercury)' },
            { num: '87', label: 'Resume score, tailored' },
            { num: '42%', label: 'Outreach response rate' },
          ]}
          slides={siftSlides}
        />

        <Showcase
          tag="Co-Founded · Live Business"
          logo="/logos/cgwalls.png"
          name="CG Walls & Floors"
          description="A real GTA renovation contractor, co-founded with Max Francis. Full-scope interior renovations — basements, kitchens, flooring, painting — sold on a site that's already converting real leads."
          stats={[
            { num: '4.8', label: 'Average client rating' },
            { num: '8', label: 'GTA cities served' },
            { num: '48h', label: 'Average quote turnaround' },
          ]}
          slides={cgSlides}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecondaryCard
            tag="In Build"
            logo="/logos/cadencestack.png"
            name="CadenceStack"
            description="A content operating system for LinkedIn growth — plans posts against strategic pillars, scores each draft on voice and strength before it ships, and tracks what actually moves impressions and inbound DMs."
            delay={0}
          />
          <SecondaryCard
            tag="Founder"
            name="CareerClarity AI"
            description="Turns raw exam data into a clear picture of where a student stands — automated, the moment scores land. Early-stage; more to show soon."
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
