import Sidebar from "@/components/sidebar";
import EditorArea from "@/components/editorArea";
import { NotesProvider } from "@/contexts/notesContext";
import { ThemeSwitcher } from "@/components/themeSwitch";

export default function Home() {
  return (
    <div className="w-full h-screen p-4 overflow-y-hidden flex flex-row">
      <NotesProvider>
        <div className="w-72 h-full">
          <Sidebar />
        </div>

        <div className="flex-1">
          <div className="fixed top-0 right-0 z-10 mr-4 mt-4">
            <ThemeSwitcher />
          </div>
          <EditorArea />
        </div>
      </NotesProvider>
    </div>
  );
}
