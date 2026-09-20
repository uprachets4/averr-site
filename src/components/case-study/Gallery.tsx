import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";

type Item = { src: string; caption: string };

export default function Gallery({
  items,
  client,
}: {
  items: Item[];
  client: string;
}) {
  const reduce = useReducedMotion();
  if (!items || items.length === 0) return null;
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "64px 0",
        position: "relative",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        borderBottom: "1px solid rgba(20,20,18,0.10)",
      }}
    >
      <div
        className="gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)`,
          gap: 4,
          padding: "0 40px",
        }}
      >
        {items.map((item, i) => (
          <GalleryItem
            key={item.src}
            item={item}
            client={client}
            index={i}
            reduce={!!reduce}
          />
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function GalleryItem({
  item,
  client,
  index,
  reduce,
}: {
  item: Item;
  client: string;
  index: number;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.figure
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.1 + index * 0.12,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "16 / 10",
        background: "var(--color-bg-alt)",
        borderRadius: 6,
        border: "1px solid rgba(20,20,18,0.08)",
      }}
    >
      <img
        src={item.src}
        alt={`${client} — ${item.caption}`}
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <motion.figcaption
        className="type-small"
        animate={{ opacity: hovered && !reduce ? 1 : 0.6 }}
        transition={{ duration: 0.25, ease: ease.outQuart }}
        style={{
          position: "absolute",
          left: 24,
          bottom: 20,
          color: "var(--color-parch)",
          background: "rgba(20,20,18,0.6)",
          backdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {item.caption}
      </motion.figcaption>
    </motion.figure>
  );
}
