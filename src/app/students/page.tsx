import { StudentsList } from "@/components/students";
import { getAllYear } from "@/action/studentsAction";

export default async function StudentsPage() {
  const res = await getAllYear();

  const yearsArray = res?.data?.years || [];

  // console.log("Years Array:", yearsArray); // ผลลัพธ์จะเป็น [ 2565, 2566, 2567, 2569 ]

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-26 min-h-screen bg-bluez-tone-4 px-10">
      {/* ส่ง yearsArray เข้าไปแทน res.data */}
      <StudentsList years={yearsArray} />
    </div>
  );
}
