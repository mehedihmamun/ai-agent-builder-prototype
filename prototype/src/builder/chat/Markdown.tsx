import { Fragment, useEffect, useState } from "react";
import { WORD_MS } from "../useBuilder";

/** **bold** inside a line. An unclosed ** (mid-stream) is closed so it never shows. */
function Inline({ text }: { text: string }) {
  const safe = (text.match(/\*\*/g)?.length ?? 0) % 2 ? `${text}**` : text;
  return (
    <>
      {safe.split(/(\*\*[^*]*\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Tiny markdown: paragraphs, "- " bullet lists and **bold**. */
export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split(/\n{2,}/).map((para, i) => {
        const lines = para.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}><Inline text={l.slice(2)} /></li>
              ))}
            </ul>
          );
        }
        return <p key={i}><Inline text={para} /></p>;
      })}
    </div>
  );
}

/** Markdown that appears word by word while `animate` is on. */
export function StreamText({ text, animate }: { text: string; animate: boolean }) {
  const all = text.split(/(\s+)/);
  const [count, setCount] = useState(animate ? 0 : all.length);

  useEffect(() => {
    if (!animate) return setCount(all.length);
    const t = window.setInterval(() => setCount((c) => (c >= all.length ? c : c + 2)), WORD_MS);
    return () => clearInterval(t);
  }, [animate, all.length]);

  return <Markdown text={all.slice(0, count).join("")} />;
}
