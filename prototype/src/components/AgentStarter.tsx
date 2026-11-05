import { useNavigate } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { BDS } from "../ds";
import { STARTER_TEMPLATES } from "../data/agentTemplates";
import { PROMPT_EXAMPLES } from "../data/examples";
import { useTemplate } from "./templates/useTemplate";
import { AgentTags } from "./AgentTags";
import { AiAgentIcon } from "./AiAgentIcon";
import { CreatingAgent, PromptBox } from "./create/PromptBox";

const { Button } = BDS;

/** "Try an example" prompts: two e-commerce, three general. */
const TRY_EXAMPLES = ["ecommerce-sales", "orders-returns", "documents", "customer-requests", "appointments"].map((id) => PROMPT_EXAMPLES.find((e) => e.id === id)!);

/**
 * Start a new agent: describe it right here (prompt box + example chips), or start from one of six templates.
 * Used by the empty state and the Create AI Agent page, so both look the same.
 * (Chosen over a "Start from scratch" button in an A/B review.)
 */
export function AgentStarter({ title, autoFocus = false }: { title: string; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const useStarter = useTemplate();

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 py-8">
      <AiAgentIcon size={72} />
      <h2 className="text-h4-600 text-foreground mt-4">{title}</h2>
      <p className="text-paragraph-400-l text-gray-100 mt-1">Describe its task, and we'll help you set it up.</p>

      <div className="mt-6 w-full max-w-[720px]">
        <PromptBox hero autoFocus={autoFocus}>
          {({ applyExample, creating }) =>
            creating ? (
              <CreatingAgent />
            ) : (
              <div className="mt-5">
                <span className="text-body-500-m text-gray-100">Try an example</span>
                {/* Side by side; wraps when a row is full, and chips stretch so every row ends flush. */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {TRY_EXAMPLES.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => applyExample(ex.prompt)}
                      title={ex.prompt}
                      className="text-paragraph-400-l text-gray-100 hover:border-blue-60 hover:bg-blue-20 hover:text-blue-90 group inline-flex max-w-full grow items-center gap-2 rounded-full border border-border bg-white py-1.5 pr-3 pl-2.5 text-left transition-colors"
                    >
                      <span className="leading-none" aria-hidden="true">
                        {ex.emoji}
                      </span>
                      <span className="truncate">{ex.preview}</span>
                      <ArrowUpRight size={14} className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )
          }
        </PromptBox>
      </div>

      <div className="text-paragraph-400-l text-gray-100 mt-10 mb-6 flex w-full items-center gap-4">
        <span className="h-px flex-1 bg-offwhite-100" />
        OR START FROM A TEMPLATE
        <span className="h-px flex-1 bg-offwhite-100" />
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {STARTER_TEMPLATES.map((t) => (
          <button
            key={t.id}
            // Opens the agent already built, on Test now (same as "Use this template").
            onClick={() => useStarter(t)}
            className="flex flex-col items-start gap-3 rounded-xl border border-offwhite-60 bg-white p-5 text-left transition-shadow hover:shadow-sm"
          >
            <span className="leading-none" style={{ fontSize: 40 }} aria-hidden="true">
              {t.icon}
            </span>
            <span className="text-h4 text-foreground">{t.title}</span>
            <AgentTags direction={t.direction ?? "Inbound"} channels={t.channels} />
            <span className="text-paragraph-400-l text-gray-100">{t.description}</span>
          </button>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mt-6" onClick={() => navigate("/templates")}>
        <BookOpen data-icon="inline-start" />
        Browse all templates
      </Button>
    </div>
  );
}
