import { MapPin, Phone } from "lucide-react";

export default function FooterRight() {
  return (
    <div className="flex flex-col gap-3 text-center md:text-left max-w-md">
      <h1 className="text-xl font-semibold text-gray-800 flex items-center justify-start gap-2">
        ติดต่อเรา
      </h1>

      <div className="flex items-start gap-2 md:justify-start">
        <MapPin className="h-4 w-4 mt-1 text-gray-500 shrink-0" />
        <p className="text-sm text-gray-600 leading-relaxed text-left md:text-left">
          ชั้น 2 อาคาร 65 มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ <br />
          1518 ถนนประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพ 10800
        </p>
      </div>

      <div className="flex items-center gap-2 md:justify-start">
        <Phone className="h-4 w-4 text-gray-500 shrink-0" />
        <p className="text-sm text-gray-600">
          โทรศัพท์: <span className="font-medium">02-555-2000 ต่อ 1234</span>
        </p>
      </div>
    </div>
  );
}
