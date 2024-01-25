import PublicHeader from "@/components/public-header";
import PublicFooter from "@/components/public-footer";

const PublicPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full min-h-screen flex-row overflow-hidden bg-slate-700">
      <div className="relative flex w-96 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <PublicHeader />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
        <PublicFooter />
      </div>
    </div>
  );
};

export default PublicPage;
