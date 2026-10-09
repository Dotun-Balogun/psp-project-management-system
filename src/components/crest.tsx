import Image from "next/image";
export const Crest = ({ size = 64 }: { size?: number }) => <Image src="/crest.png" alt="Plateau State Polytechnic crest" width={size} height={size} className="object-contain" priority />;
