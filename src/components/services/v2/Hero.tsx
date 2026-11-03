import type { CSSProperties } from "react";
import {
  SERVICES,
  TRADES,
  TRADE_ORDER,
  heroName,
  type TradeId,
} from "../../../data/servicesBuild";

/**
 * The hero: the headline that takes the visitor's name, the field they
 * type it into, the five trades, and the four services on the right.
 *
 * The name falls back to "your business" here, not to the trade's own
 * business name — the headline has to read as a sentence before anyone
 * has typed anything.
 *
 * Nothing about the name leaves the page: no request, no storage, and
 * the field is capped at 28 characters as the reference caps it.
 */
export default function Hero({
  typed,
  onTyped,
  trade,
  onTrade,
  onJump,
}: {
  typed: string;
  onTyped: (v: string) => void;
  trade: TradeId;
  onTrade: (t: TradeId) => void;
  onJump: (g: number) => void;
}) {
  return (
    <section className="hero gut">
      <div className="beams" aria-hidden="true">
        <i className="beam" />
        <i className="beam" />
        <i className="beam" />
        <i className="beam" />
      </div>

      <div className="wrap">
        <div>
          <span className="eyebrow">Services</span>
          <h1>
            Four services. Built around <span className="gt">{heroName(typed)}</span>.
          </h1>
          <p className="sub">
            Name your business, then scroll. We'll build all twelve pieces for it while
            you watch.
          </p>

          <div className="maker">
            <div className="field">
              <label htmlFor="biz">Your business name</label>
              <input
                id="biz"
                maxLength={28}
                autoComplete="organization"
                spellCheck={false}
                placeholder="Northside Renovations"
                value={typed}
                onChange={(e) => onTyped(e.target.value)}
              />
            </div>
            <div>
              <span className="tlabel" id="tl">
                What you do
              </span>
              <div
                className="chipset"
                id="trades"
                role="group"
                aria-labelledby="tl"
                style={{ marginTop: 10 }}
              >
                {TRADE_ORDER.map(function chip(id) {
                  return (
                    <button
                      type="button"
                      key={id}
                      aria-pressed={id === trade}
                      onClick={() => onTrade(id)}
                    >
                      {TRADES[id].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <nav className="svcmap" id="svcmap" aria-label="Jump to a service">
          {SERVICES.map(function service(s, g) {
            return (
              <button
                type="button"
                key={s.id}
                style={{ "--c": s.color } as CSSProperties}
                onClick={() => onJump(g)}
              >
                <i />
                <b>{s.name}</b>
                <span>{s.line}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
