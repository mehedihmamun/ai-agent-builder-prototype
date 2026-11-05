import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SAMPLE_AGENTS, type Agent } from "../data/agents";
import type { BuildState } from "../builder/types";

const STORAGE_KEY = "agent-builder-prototype:v4";

interface PersistedState {
  agents: Agent[];
  introSeen: boolean;
  /** Builder conversation and answers per agent id. */
  builds: Record<string, BuildState>;
}

interface AppStore extends PersistedState {
  toggleAgent: (id: string, active: boolean) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  setIntroSeen: (seen: boolean) => void;
  saveBuild: (id: string, build: BuildState) => void;
  loadSampleAgents: () => void;
  clearAgents: () => void;
  resetPrototype: () => void;
}

// First visit tells the "new user" story: no agents yet, intro popup shows.
const INITIAL: PersistedState = { agents: [], introSeen: false, builds: {} };

function readState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const { agents, introSeen, builds } = { ...INITIAL, ...JSON.parse(raw) };
    return { agents, introSeen, builds };
  } catch {
    return INITIAL;
  }
}

const Ctx = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(readState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage is a convenience only; the prototype works without it.
    }
  }, [state]);

  const toggleAgent = useCallback((id: string, active: boolean) => {
    setState((s) => ({ ...s, agents: s.agents.map((a) => (a.id === id ? { ...a, active } : a)) }));
  }, []);
  const addAgent = useCallback((agent: Agent) => setState((s) => ({ ...s, agents: [agent, ...s.agents] })), []);
  const updateAgent = useCallback((id: string, patch: Partial<Agent>) => {
    setState((s) => ({ ...s, agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  }, []);
  const setIntroSeen = useCallback((introSeen: boolean) => setState((s) => ({ ...s, introSeen })), []);
  const saveBuild = useCallback((id: string, build: BuildState) => {
    setState((s) => ({ ...s, builds: { ...s.builds, [id]: build } }));
  }, []);
  const loadSampleAgents = useCallback(() => setState((s) => ({ ...s, agents: SAMPLE_AGENTS, builds: {} })), []);
  const clearAgents = useCallback(() => setState((s) => ({ ...s, agents: [], builds: {} })), []);
  const resetPrototype = useCallback(() => setState(INITIAL), []);

  const value = useMemo(
    () => ({ ...state, toggleAgent, addAgent, updateAgent, setIntroSeen, saveBuild, loadSampleAgents, clearAgents, resetPrototype }),
    [state, toggleAgent, addAgent, updateAgent, setIntroSeen, saveBuild, loadSampleAgents, clearAgents, resetPrototype],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const store = useContext(Ctx);
  if (!store) throw new Error("useAppStore must be used inside AppStoreProvider");
  return store;
}
