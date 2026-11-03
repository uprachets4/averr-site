import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00", "10:30", "1:00", "3:30"];

/** Websites 3 of 3 — bookings and enquiries. */
export default function W3Booking({ f }: { f: Fields }) {
  return (
    <>
      <Chrome url={<>{f.domain}/book</>} tint="#F9AF97" />
      <div className="vp lt bookflow">
        <div className="ghost" />
        <div className="bmodal">
          <span className="mono mt">{f.name}</span>
          <h6>{f.trade.cta}</h6>

          <div className="days">
            {DAYS.map(function day(d, i) {
              return (
                <span className={i === 2 ? "pick" : undefined} key={d}>
                  {d}
                  <b>{10 + i}</b>
                </span>
              );
            })}
          </div>

          <div className="times r3">
            {TIMES.map(function time(t, i) {
              return (
                <span className={i === 1 ? "pick" : undefined} key={t}>
                  {t}
                </span>
              );
            })}
          </div>

          <div className="bconf r4">
            <span className="ok">✓</span>
            <span>
              You're booked for Wednesday at 10:30. It's in {f.name}'s calendar.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
