import { useState } from "react";
import { FlaskConical, MessagesSquare, PenLine, Play } from "lucide-react";
import { BDS } from "../ds";

const { Dialog, DialogContent, DialogTitle, DialogDescription, Button } = BDS;

const STEPS = [
  {
    title: "Introducing AI Agent Builder ✨",
    text: "Build powerful AI agents to automate conversations and support users effortlessly. Watch this quick video to see how it works step by step. Get started in minutes and bring your AI agent to life.",
    visual: "video",
  },
  {
    title: "Describe your agent",
    text: "Tell us in plain words what your agent should do. Not sure where to start? Pick one of the examples.",
    visual: PenLine,
  },
  {
    title: "Answer a few questions",
    text: "The Agent Builder Assistant asks about your business and builds the agent's flow on the canvas as you answer.",
    visual: MessagesSquare,
  },
  {
    title: "Test and go live",
    text: "Try your agent with Test now, then switch it on when you're happy with its replies.",
    visual: FlaskConical,
  },
] as const;

/** First-visit intro popup (wireframe screen 1). */
export function IntroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="w-[700px] max-w-[calc(100vw-32px)] gap-0 p-2.5 sm:max-w-[700px]">
        <div className="relative flex aspect-[16/8.5] items-center justify-center overflow-hidden rounded-lg bg-black">
          {s.visual === "video" ? (
            <>
              <div className="absolute top-8 right-8 text-right">
                <div className="text-h1 text-white">Agent Builder</div>
                <div className="text-h3-600 text-yellow-80">IN 16 MINS</div>
              </div>
              <button
                aria-label="Play video"
                className="flex size-20 items-center justify-center rounded-full bg-blue-90 text-white shadow-lg transition-transform hover:scale-105"
              >
                <Play size={32} fill="currentColor" />
              </button>
            </>
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full bg-white/10 text-white">
              <s.visual size={44} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="px-6 pt-6 pb-2 text-center">
          <DialogTitle className="text-h3-600 text-foreground">{s.title}</DialogTitle>
          <DialogDescription className="text-paragraph-400-xl text-gray-100 mx-auto mt-2 max-w-[560px]">
            {s.text}
          </DialogDescription>
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Previous
          </Button>
          <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-gray-100" : "w-1.5 bg-gray-20"}`} />
            ))}
          </div>
          <Button onClick={() => (last ? onClose() : setStep(step + 1))}>{last ? "Get started" : "Next"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
