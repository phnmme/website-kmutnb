export default function FooterLeft() {
  return (
    <div className="flex flex-col gap-2 text-center md:text-left">
      <h1 className="text-xl font-semibold text-gray-800 flex items-center justify-center md:justify-start gap-2">
        ภาควิชาการจัดการเทคโนโลยีการผลิตและสารสนเทศ
      </h1>

      <p className="text-sm text-gray-600">วิทยาลัยเทคโนโลยีอุตสาหกรรม</p>
      <p className="text-sm text-gray-600">
        มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
      </p>
    </div>
  );
}
