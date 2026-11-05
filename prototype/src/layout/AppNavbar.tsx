import { BarChart3, Bell, Gift, Inbox, Settings, SquareUser, Workflow } from "lucide-react";
import { BDS } from "../ds";

const { Navbar, RevechatMark } = BDS;

const navIcon = (Icon: typeof Inbox) => <Icon size={20} strokeWidth={1.5} />;

const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: navIcon(Inbox) },
  { id: "automation", label: "Automation", icon: navIcon(Workflow) },
  { id: "reports", label: "Reports", icon: navIcon(BarChart3) },
  { id: "contacts", label: "Contacts", icon: navIcon(SquareUser) },
];

const NAV_FOOTER = [
  { id: "notifications", label: "Notifications", icon: navIcon(Bell) },
  { id: "settings", label: "Settings", icon: navIcon(Settings) },
  { id: "whats-new", label: "What's new", icon: navIcon(Gift) },
];

/** The app's purple icon rail, with Automation selected. */
export function AppNavbar() {
  return (
    <Navbar
      value="automation"
      logo={<RevechatMark width={28} height={22} />}
      items={NAV_ITEMS}
      footerItems={NAV_FOOTER}
      user={{ name: "Mehedi Hasan Mamun", status: "online" }}
    />
  );
}
