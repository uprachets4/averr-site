import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSetNavDarkOverride } from "../../lib/navTone";
import { useDeclarePageEndTone } from "../../lib/pageTone";
import { useDocumentMeta, META } from "../../lib/documentMeta";
import "./roi.css";

/**
 * /tools/automation-roi — what a repeated task costs in time.
 *
 * The second of the two link-earning assets in the plan, and the same
 * bet as the findability checker: every other item in the backlinks
 * section needs the owner to ask somebody for a favour, and a tool
 * people link to does not.
 *
 * Four decisions worth writing down.
 *
 * Hours lead, money follows. The brief said "hours saved × hourly
 * cost", and the site states no prices anywhere. Both are satisfied by
 * putting the hours first — they come straight from what the visitor
 * typed and are not arguable — and treating the rate as optional. When
 * a rate is given the amount is written "CAD 18,200" rather than with
 * a currency symbol, which keeps the no-dollar-signs rule intact while
 * still answering the question the brief asked.
 *
 * The share-removed slider starts at 100%. Every calculator of this
 * kind ships with a flattering default — 70%, 80% — and that number is
 * invented. At 100% the first figure on screen is the full cost of the
 * task, which is a fact about the visitor's own inputs. Moving the
 * slider is then explicitly their assumption, and the wording says so.
 *
 * Forty-eight weeks, not fifty-two. A weekly task is not done on
 * statutory holidays or through a closed week, and 52 overstates by
 * about 8% in the direction that happens to flatter the person selling
 * automation. Stated on the page rather than buried.
 *
 * It does not estimate what the automation would cost to build. That
 * depends entirely on the task, and a number invented here would be
 * the one thing on the page a reader could catch us on.
 */

const WORKING_WEEKS = 48;
const HOURS_PER_DAY = 7.5;

function num(v: string): number {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** 18200 → "18,200". No currency symbol anywhere on this site. */
function group(n: number): string {
  return Math.round(n).toLocaleString("en-CA");
}

export default function AutomationRoi() {
  useDocumentMeta(META.toolAutomationRoi.title, META.toolAutomationRoi.description);
  useDeclarePageEndTone("dark");

  const [task, setTask] = useState("");
  const [people, setPeople] = useState("1");
  const [perWeek, setPerWeek] = useState("");
  const [minutes, setMinutes] = useState("");
  const [rate, setRate] = useState("");
  const [share, setShare] = useState(100);

  /* Same navy-ground override the checker and the pillar pages make:
     without it the nav renders near-black on navy. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      const body = document.body;
      const prevBg = body.style.backgroundColor;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      body.style.backgroundColor = "#121C27";
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
        body.style.backgroundColor = prevBg;
      };
    },
    [setNavDark]
  );

  const out = useMemo(
    function totals() {
      const n = num(people) || 1;
      const times = num(perWeek);
      const mins = num(minutes);
      const hoursWeek = (n * times * mins) / 60;
      const hoursYear = hoursWeek * WORKING_WEEKS;
      const removed = hoursYear * (share / 100);
      const hourly = num(rate);
      return {
        ready: times > 0 && mins > 0,
        hoursWeek,
        hoursYear,
        removed,
        days: removed / HOURS_PER_DAY,
        cost: hourly > 0 ? removed * hourly : 0,
        hasRate: hourly > 0,
      };
    },
    [people, perWeek, minutes, rate, share]
  );

  const label = task.trim() || "this task";

  return (
    <div className="sv roi">
      <nav className="wcrumbs wrap" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <span aria-current="page">Automation calculator</span>
          </li>
        </ol>
      </nav>

      <header className="roi-hero gut">
        <div className="wrap">
          <span className="eyebrow">Free tool</span>
          <h1>
            What is that one job <span className="roi-acc">actually costing you?</span>
          </h1>
          <p className="roi-sub">
            Every business has a task somebody does over and over that nobody has ever added up.
            Four numbers and you will know what it costs in a year. Nothing is sent anywhere, and
            there is no email to give.
          </p>
        </div>
      </header>

      <div className="wrap gut">
        <form className="roi-form" onSubmit={(e) => e.preventDefault()}>
          <div className="roi-row">
            <label htmlFor="roi-task">What is the task?</label>
            <input
              id="roi-task"
              type="text"
              placeholder="Retyping job sheets into the invoicing software"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <span className="roi-hint">Optional. Only used to word the answer.</span>
          </div>

          <div className="roi-pair">
            <div className="roi-row">
              <label htmlFor="roi-times">How many times a week?</label>
              <input
                id="roi-times"
                type="number"
                inputMode="numeric"
                min="0"
                placeholder="20"
                value={perWeek}
                onChange={(e) => setPerWeek(e.target.value)}
              />
            </div>
            <div className="roi-row">
              <label htmlFor="roi-mins">Minutes each time?</label>
              <input
                id="roi-mins"
                type="number"
                inputMode="numeric"
                min="0"
                placeholder="12"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="roi-pair">
            <div className="roi-row">
              <label htmlFor="roi-people">How many people do it?</label>
              <input
                id="roi-people"
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />
            </div>
            <div className="roi-row">
              <label htmlFor="roi-rate">What does an hour of their time cost?</label>
              <input
                id="roi-rate"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="35"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="roi-hint">
                Optional, in Canadian dollars. Wage plus what you pay on top of it.
              </span>
            </div>
          </div>
        </form>

        {out.ready ? (
          <div className="roi-out" aria-live="polite">
            <p className="roi-big">
              <span>{group(out.removed)} hours</span> a year.
            </p>
            <p className="roi-line">
              That is what {label} takes across {WORKING_WEEKS} working weeks
              {share < 100 ? `, if automating it removed ${share}% of the work` : ""}
              {out.hasRate ? `, and about CAD ${group(out.cost)} of someone's paid time` : ""}.
            </p>

            <div className="roi-grid">
              <div className="roi-stat">
                <b>{out.hoursWeek.toFixed(1)}</b>
                <span>hours a week</span>
              </div>
              <div className="roi-stat">
                <b>{group(out.days)}</b>
                <span>working days a year, at {HOURS_PER_DAY} hours a day</span>
              </div>
              <div className="roi-stat">
                <b>{group(out.hoursYear)}</b>
                <span>hours before any automation</span>
              </div>
            </div>

            <div className="roi-share">
              <label htmlFor="roi-share">
                How much of it do you think automation would actually remove? {share}%
              </label>
              <input
                id="roi-share"
                type="range"
                min="10"
                max="100"
                step="5"
                value={share}
                onChange={(e) => setShare(Number(e.target.value))}
              />
              <p className="roi-hint">
                This one is your estimate, not ours. It starts at everything because that is the
                only figure on this page we can get from your own numbers — the rest of it depends
                on how many exceptions still need a person, and nobody can tell you that from here.
              </p>
            </div>
          </div>
        ) : null}

        <p className="roi-note">
          <strong>What this does not count.</strong> It does not estimate what the automation would
          cost to build, because that depends entirely on the task and a number invented here would
          be the one thing on this page you could catch us out on. It also assumes {WORKING_WEEKS}{" "}
          working weeks rather than 52, which allows for holidays and closed weeks — that is the
          conservative direction, and it understates rather than flatters.
        </p>

        <div className="roi-end">
          <p>
            If the number surprised you, that is usually the sign the task is worth looking at. The
            next question is which parts of it a person still has to do, which is a conversation
            rather than a calculator. There is{" "}
            <Link to="/guides/how-to-write-a-software-brief">
              a guide on this site about writing the brief
            </Link>{" "}
            for that, and <Link to="/contact">a thirty-minute call</Link> costs nothing.
          </p>
        </div>

        {/* The page was a calculator and about 150 words, which earns
            links and ranks for nothing. This is the readable half:
            what to do with the figure, and the three honest limits on
            reading too much into it. */}
        <section className="roi-explain">
          <h2>What to do with the number</h2>
          <p>
            A figure on its own decides nothing. What makes it useful is comparing it against the
            three things you could do with that task, in rough order of how often they are the
            right answer.
          </p>

          <h3>Change the process</h3>
          <p>
            The cheapest fix is almost always removing a step rather than automating it. A weekly
            report nobody reads, a form that asks for information already in another system, an
            approval that has never once been refused. If the task exists because of a decision
            made years ago that nobody has revisited, the annual cost above is the argument for
            revisiting it, and the fix costs nothing.
          </p>

          <h3>Buy something</h3>
          <p>
            Most repeated office work has a tool built for it, and buying beats building the great
            majority of the time. Build only wins when the thing you do is genuinely not what
            everyone else does — which is rarer than it feels from the inside.{" "}
            <Link to="/guides/build-vs-buy-software">
              Build or buy: when custom software pays
            </Link>{" "}
            sets out the one test that holds up, with three projects that met it.
          </p>

          <h3>Build something</h3>
          <p>
            Worth it when the task is specific to how your business works, when the cost above is
            recurring rather than seasonal, and when the people doing it are the people you can
            least afford to have doing it. If the task is currently held together by a spreadsheet
            that several people edit,{" "}
            <Link to="/guides/when-to-replace-a-spreadsheet">
              there is a point where that stops being enough
            </Link>{" "}
            and four fairly clear signs you have passed it.
          </p>

          <h2>Three reasons to read the figure carefully</h2>
          <p>
            <strong>Hours saved are not hours recovered.</strong> Removing four hours a week from
            someone's job does not hand you four hours of new output. It hands you back attention,
            usually spread thin, and the value of that depends entirely on what they do instead.
          </p>
          <p>
            <strong>Almost nothing automates to zero.</strong> The slider above starts at 100% on
            purpose, because that is the honest starting point — the full cost of the task as you
            described it. Most real automation removes somewhere between half and most of a job
            and leaves a person checking the output. Moving the slider is you making an
            assumption, and the page would rather you made it deliberately than inherited a
            flattering default.
          </p>
          <p>
            <strong>An hourly rate is not the full cost of the person.</strong> If you entered a
            wage, the real figure is higher once you account for everything employing someone
            actually costs. The calculation here stays with the number you typed rather than
            marking it up, because a multiplier invented on this page would be the part you could
            fairly argue with.
          </p>
        </section>
      </div>
    </div>
  );
}
