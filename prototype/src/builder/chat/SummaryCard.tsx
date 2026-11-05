import { Eye, Play } from "lucide-react";
import { BDS } from "../../ds";
import { answerLabel, businessRow, canvasTools, channelsLabel, goalsFor, handoverFor, hoursLabel, teamLabel, type Answers } from "../script";

const { Badge, Button } = BDS;

/** The finished agent at a glance, at the end of setup. */
export function SummaryCard({ agentName, answers, onTestNow, onReview }: { agentName: string; answers: Answers; onTestNow: () => void; onReview: () => void }) {
  const rows: [string, string][] = [
    businessRow(answers),
    ["Channels", channelsLabel(answers)],
    ["Handles", answers.profile ? goalsFor(answers).map((g) => g.title).join(", ") : answerLabel("goals", answers.goals)],
    ["Data", canvasTools(answers).filter((t) => t.id !== "hours").map((t) => t.label).join(", ") || "Instructions only"],
    ...(answers.hours?.hours ? [["Hours", `${hoursLabel(answers.hours)} · after hours: ${answerLabel("afterhours", answers.afterhours).toLowerCase()}`] as [string, string]] : []),
    ["Handover", `${handoverFor(answers).length} reasons → ${teamLabel(answers)}`],
    ...(answers.limits?.ids.length ? [["Rules", answerLabel("limits", answers.limits)] as [string, string]] : []),
    ["Voice", `${answerLabel("language", answers.language)} · ${answerLabel("tone", answers.tone)}`],
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-offwhite-80 bg-white shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-offwhite-80 bg-offwhite-20 px-4 py-3">
        <span className="text-h6-600 text-foreground min-w-0 flex-1 truncate">{agentName}</span>
        <Badge tone="green" variant="light" shape="pill">Ready</Badge>
      </div>
      <dl className="space-y-2 px-4 py-3">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[76px_1fr] gap-2">
            <dt className="text-body-500-m text-gray-100 pt-px">{k}</dt>
            <dd className="text-paragraph-400-l text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex gap-2 border-t border-offwhite-80 px-4 py-3">
        <Button size="sm" onClick={onTestNow}>
          <Play data-icon="inline-start" />
          Test now
        </Button>
        <Button variant="outline" size="sm" onClick={onReview}>
          <Eye data-icon="inline-start" />
          Review on canvas
        </Button>
      </div>
    </div>
  );
}
