import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStore";
import { AppShell } from "./layout/AppShell";
import { AgentsPage } from "./pages/AgentsPage";
import { CreateAgentPage } from "./pages/CreateAgentPage";
import { BuilderPage } from "./pages/BuilderPage";
import { TemplatesPage } from "./pages/TemplatesPage";

// The shareable single HTML file opens from disk (file://), where only hash URLs work.
const Router = import.meta.env.MODE === "share" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <AppStoreProvider>
      <Router>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/new" element={<CreateAgentPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
          </Route>
          <Route path="/agents/:id/builder" element={<BuilderPage />} />
          <Route path="*" element={<Navigate to="/agents" replace />} />
        </Routes>
      </Router>
    </AppStoreProvider>
  );
}
