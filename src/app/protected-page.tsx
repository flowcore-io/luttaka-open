"use client";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {Menu} from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {useState} from "react";
import {RestrictedToRole} from "@/components/restricted-to-role";

const ProtectedPage = ({children}: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div className="hidden sm:block">
        <Sidebar/>
      </div>
      <div className="fixed left-2 top-2 z-50 sm:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger>
            <Menu size={36}/>
          </SheetTrigger>
          <SheetContent side="left" className="border-0 p-0">
            <Sidebar isSidebarOpen setIsSidebarOpen={setIsSidebarOpen}/>
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative flex w-96 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header/>
        <main>
          <RestrictedToRole role={"admin"}>
            <div className={"mt-1 bg-primary text-center"}>
              <p className={"text-primary-foreground font-thin text-[0.85rem]"}>you are an <b>admin</b></p>
            </div>
          </RestrictedToRole>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedPage;
