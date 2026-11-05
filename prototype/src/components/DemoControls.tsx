import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { BDS } from "../ds";
import { useAppStore } from "../store/AppStore";

const { Popover, PopoverTrigger, PopoverContent, Button } = BDS;

/** Prototype-only helper to jump between demo states. Not part of the product UI. */
export function DemoControls() {
  const navigate = useNavigate();
  const { loadSampleAgents, clearAgents, setIntroSeen, resetPrototype } = useAppStore();

  const go = (fn: () => void) => () => {
    fn();
    navigate("/agents");
  };

  return (
    <div className="fixed bottom-4 left-16 z-40">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="shadow-md">
            <FlaskConical data-icon="inline-start" />
            Prototype
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-1">
          <p className="text-body-500-m text-gray-100 px-2 py-1.5">Demo states</p>
          {[
            ["Show empty state", go(clearAgents)],
            ["Load sample agents", go(loadSampleAgents)],
            ["Replay intro popup", go(() => setIntroSeen(false))],
            ["Reset everything", go(resetPrototype)],
          ].map(([label, onClick]) => (
            <button
              key={label as string}
              onClick={onClick as () => void}
              className="text-paragraph-400-l text-gray-100 hover:bg-offwhite-40 block w-full rounded-sm px-2 py-1.5 text-left"
            >
              {label as string}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
