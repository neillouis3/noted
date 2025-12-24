import Image from "next/image";
import LexicalTextarea from "@/components/textarea/editor";
import Sidebar from "@/components/sidebar"; 
import { NotesProvider } from "@/contexts/notesContext";
import { ThemeSwitcher } from "@/components/themeSwitch";
import ToolbarPlugin from "@/components/textarea/plugins/toolbarPlugin";

export default function Home() {
  return (
    <div className="w-full h-screen p-4 overflow-y-hidden flex flex-row">
      <NotesProvider>
      <div className="w-72 h-full">
        <Sidebar />
      </div>
      
      <div className="flex-1">
        <div className=" fixed top-0 right-0 z-10 mr-4 mt-4">

          <ThemeSwitcher />
        </div>
        <LexicalTextarea />
      </div>
      </NotesProvider>
    </div>
  );
}
