import Link from "next/link";

const PROPS = [
  {
    icon: "verified_user",
    title: "SỞ HỮU XÁC THỰC NFT",
    body: "Chip NFC + hộ chiếu số Polygon theo giày trọn đời. Không thể làm giả, sang tay minh bạch.",
    href: "/passport",
    cta: "XEM HỘ CHIẾU →",
  },
  {
    icon: "precision_manufacturing",
    title: "CARBON & TITANIUM HÀNG KHÔNG",
    body: "Khung carbon nguyên khối, khóa Titanium Grade 5, đệm nitrogen rebound 87%.",
    href: "/artifact",
    cta: "MỔ XẺ K-09 →",
  },
  {
    icon: "diamond",
    title: "GIỚI HẠN 500 ĐÔI TOÀN CẦU",
    body: "Mỗi drop đánh số edition, hết là hết. Syndicate được mua trước 60 phút.",
    href: "/gallery",
    cta: "VÀO ARCHIVE →",
  },
];

export default function ValueProps() {
  return (
    <section className="w-full bg-surface-container-lowest py-space-4xl">
      <div className="mx-auto max-w-[1400px] px-gutter-mobile lg:px-gutter-desktop">
        <p className="flex items-center gap-space-xs font-label-technical text-label-technical uppercase tracking-widest text-primary-container">
          <span className="material-symbols-outlined text-[16px]">military_tech</span>
          03 // TẠI SAO KINESIS
        </p>
        <div className="mt-space-2xs flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <h2 className="font-display-lg text-display-lg uppercase leading-none tracking-tight text-primary">
            3 LÝ DO <span className="text-primary-container">DUY NHẤT</span>
          </h2>
          <p className="max-w-md font-body-lg text-body-lg text-secondary">
            Không phải sneaker thời trang. Là hiện vật kỹ thuật có chứng minh thư số.
          </p>
        </div>

        <div className="mt-space-xl grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {PROPS.map((p) => (
            <div key={p.title} className="border border-surface-container-highest bg-surface-container-low p-space-lg">
              <span className="grid size-11 place-items-center bg-primary-container text-on-primary-container">
                <span className="material-symbols-outlined text-[22px]">{p.icon}</span>
              </span>
              <h3 className="mt-space-md font-headline-sm text-headline-sm uppercase tracking-tight text-primary">
                {p.title}
              </h3>
              <p className="mt-space-xs font-body-sm text-body-sm leading-5 text-secondary">{p.body}</p>
              <Link
                href={p.href}
                className="mt-space-md inline-block font-label-technical text-label-technical font-bold uppercase tracking-widest text-primary-container transition-colors hover:text-primary"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
