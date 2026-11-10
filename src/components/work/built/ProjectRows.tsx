import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BUILT, type BuiltProject } from "../../../data/builtByAverr";
import {
  SERVICE_COLOR,
  SERVICE_NAMES,
  type ServiceId,
} from "../../../data/serviceColors";
import { Chips, Dots, ThesisPill } from "./bits";
import Slideshow from "./Slideshow";

/**
 * The project list: one full-width row each, opening into a live
 * preview.
 *
 * Opening is hover on a pointer device and tap on a touch one — the
 * first tap opens the row, the second goes to the case file, which is
 * what the row button does in both cases. Exactly one row is open at a
 * time, the first on arrival, and only that row's video is ever
 * playing.
 *
 * Videos carry no `src` until the row they belong to opens. With
 * `preload="none"` alone the browser still resolves and may range-read
 * the file; with no src at all, a visitor who never opens a row pays
 * nothing for four recordings.
 *
 * The open project's accent is written straight onto the page glow
 * rather than lifted into page state: it changes on every hover, and
 * state here would re-render the wall's seventy images with it.
 */

const SERVICE_ORDER: ServiceId[] = ["websites", "webApps", "aiAutomation", "marketing"];

export default function ProjectRows({
  glowRef,
}: {
  glowRef: React.RefObject<HTMLDivElement | null>;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(BUILT[0].slug);
  const [filter, setFilter] = useState<ServiceId | null>(null);
  const videos = useRef(new Map<string, HTMLVideoElement | null>());

  /* Only the open row plays, and a video only gets a src once its row
     has actually been opened. */
  useEffect(
    function playOnlyTheOpenRow() {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      videos.current.forEach(function each(video, slug) {
        if (!video) return;
        if (slug !== open) {
          video.pause();
          return;
        }
        if (reduce) return;
        const project = BUILT.find((p) => p.slug === slug);
        if (!video.getAttribute("src") && project?.video) {
          video.setAttribute("src", project.video.src);
        }
        /* a rejected play() is normal — a backgrounded tab, no codec,
           a reader who has not interacted yet — and the poster stays */
        video.play().catch(function posterItIs() {});
      });
    },
    [open]
  );

  /* The stage takes the open project's colour. */
  useEffect(
    function tintTheGlow() {
      const project = BUILT.find((p) => p.slug === open);
      glowRef.current?.style.setProperty("--gc", project ? project.c : "#9874E8");
    },
    [open, glowRef]
  );

  const shown = BUILT.filter(function matches(p) {
    return !filter || p.svc.includes(filter);
  });

  return (
    <section className="bb-list bb-gut" aria-label="Projects">
      <div className="bb-wrap">
        <div className="bb-bar">
          <div className="bb-filters" role="group" aria-label="Filter by service">
            {SERVICE_ORDER.map(function toggle(id) {
              const on = filter === id;
              return (
                <button
                  type="button"
                  key={id}
                  aria-pressed={on}
                  onClick={() => setFilter(on ? null : id)}
                  style={{ "--c": SERVICE_COLOR[id] } as CSSProperties}
                >
                  <i className="bb-dot" style={{ "--c": SERVICE_COLOR[id] } as CSSProperties} />
                  {SERVICE_NAMES[id]}
                </button>
              );
            })}
          </div>
          <span className="bb-count">
            {String(shown.length).padStart(2, "0")} of{" "}
            {String(BUILT.length).padStart(2, "0")} projects
          </span>
        </div>

        <div>
          {BUILT.map(function row(p, i) {
            const isOpen = p.slug === open;
            const dim = !!filter && !p.svc.includes(filter);
            return (
              <article
                className={`bb-row${isOpen ? " bb-open" : ""}${dim ? " bb-dim" : ""}`}
                key={p.slug}
                onMouseEnter={function hover() {
                  if (window.matchMedia("(hover: hover)").matches) setOpen(p.slug);
                }}
              >
                <button
                  className="bb-rowbtn"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={function openOrGo() {
                    if (isOpen) navigate(`/work/${p.slug}`, { state: { from: "work" } });
                    else setOpen(p.slug);
                  }}
                >
                  <span className="bb-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="bb-rname">{p.name}</span>
                  <span className="bb-rmeta">
                    <span className="bb-svc">
                      <Dots svc={p.svc} />
                    </span>
                    <span>{p.sector}</span>
                    <span>{p.year}</span>
                  </span>
                </button>

                <div className="bb-peek">
                  <div>
                    <div className="bb-peekin">
                      <Preview project={p} videos={videos} />
                      <div className="bb-pvside">
                        <div className="bb-chips">
                          <Chips svc={p.svc} />
                        </div>
                        <p className="bb-th">
                          <ThesisPill thesis={p.thesis} pill={p.pill} />
                        </p>
                        {p.figure ? (
                          <div className="bb-stat">
                            <b className="bb-gt">{p.figure.value}</b>
                            <span>{p.figure.caption}</span>
                          </div>
                        ) : null}
                        <Link
                          className="bb-open-cta"
                          to={`/work/${p.slug}`}
                          state={{ from: "work" }}
                          data-no-wipe
                        >
                          Open the case file →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Preview({
  project,
  videos,
}: {
  project: BuiltProject;
  videos: React.MutableRefObject<Map<string, HTMLVideoElement | null>>;
}) {
  return (
    <div className="bb-pv">
      {project.video ? (
        <>
          <img src={project.video.poster} alt="" decoding="async" />
          <video
            ref={(el) => {
              videos.current.set(project.slug, el);
            }}
            muted
            loop
            playsInline
            preload="none"
            poster={project.video.poster}
            aria-label={`Screen recording of ${project.name}`}
          />
        </>
      ) : (
        <Slideshow slides={project.slides!} name={project.name} />
      )}
    </div>
  );
}
