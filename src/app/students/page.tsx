import { StudentsList } from "@/components/students";
import data from "./data";

export default function StudentsPage() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden  pt-26  min-h-screen bg-bluez-tone-4 px-10">
      <StudentsList students={data} />
    </div>
  );
}
