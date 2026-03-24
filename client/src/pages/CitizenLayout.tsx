import { Outlet } from "react-router-dom";
import CitizenSidebar from "@/components/CitizenSidebar";

export default function CitizenLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <CitizenSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
