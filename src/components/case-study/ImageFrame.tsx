import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant: "hero" | "inline" | "gallery" | "card";
  className?: string;
};

export default function ImageFrame({ children, variant, className }: Props) {
  const classes = ["image-frame", `image-frame--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="image-frame__media">{children}</div>
      <style>{`
        .image-frame {
          width: 100%;
          padding: 28px;
          background: linear-gradient(180deg, rgba(20,20,18,0.02), rgba(20,20,18,0.05));
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(20,20,18,0.06), 0 2px 8px rgba(20,20,18,0.04);
          box-sizing: border-box;
        }

        .image-frame--hero {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 40px;
        }

        .image-frame__media {
          overflow: hidden;
          border-radius: 8px;
        }

        .image-frame__media > img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }

        @media (max-width: 720px) {
          .image-frame,
          .image-frame--hero {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
