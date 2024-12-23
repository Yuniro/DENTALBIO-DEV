import { Inter } from "next/font/google";
import "./styles.css";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RightPanel from "./components/RightPanel";

import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Dashboard | Dentalbio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="member-panel-wrapper">
        <div className="container member-container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 col-12 mb-3">
              <Sidebar />
            </div>
            <div className="col-xl-6 col-12">{children}</div>
            <RightPanel />
          </div>
        </div>
      </div>
    </>
  );
}
