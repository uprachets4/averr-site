import { useEffect, useRef, type CSSProperties } from "react";
import type { BuiltProject } from "../../../data/builtByAverr";
import { SERVICE_COLOR, SERVICE_NAMES } from "../../../data/serviceColors";
import { ThesisPill } from "./bits";
import Slideshow from "./Slideshow";

/**
 * The case file's opening screen: the recording playing behind the
 * project name, the thesis, and the four facts.
 *
 * The recording is the only video on the route and it starts as soon
 * as the hero mounts, which is what the reference does. Under reduced
 * motion it never plays and the poster stands in its place.
 */
export default function CaseHero({ project, index }: { project: BuiltProject; index: number }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(function playHero() {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(function posterItIs() {});
  }, []);

  return (
    <header className="bb-chero bb-gut">
      {project.video ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          src={project.video.src}
          poster={project.video.poster}
          aria-label={`Screen recording of ${project.name}`}
        />
      ) : (
        <Slideshow slides={project.slides!} name={project.name} />
      )}

      <div className="bb-wrap">
        <span className="bb-eyebrow">
          Case file {String(index + 1).padStart(2, "0")} <b>· {project.sector}</b>
        </span>
        <h1>{project.name}</h1>
        <p className="bb-thesis">
          <ThesisPill thesis={project.thesis} pill={project.pill} />
        </p>
        <div className="bb-facts">
          <div>
            <b>Client</b>
            <span>{project.name}</span>
          </div>
          <div>
            <b>Sector</b>
            <span>{project.sector}</span>
          </div>
          <div>
            <b>Services</b>
            <span className="bb-svcs">
              {project.svc.map(function service(id) {
                return (
                  <em key={id}>
                    <i className="bb-dot" style={{ "--c": SERVICE_COLOR[id] } as CSSProperties} />
                    {SERVICE_NAMES[id]}
                  </em>
                );
              })}
            </span>
          </div>
          <div>
            <b>Timeline</b>
            <span>{project.year}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
