import SectionWrapper from "@/components/wrapper/section-wrapper";
import { MetaData } from "@/constant/metaData";


export default function About() {
  return (
    <SectionWrapper id="about" className="py-16">
      <div className="flex flex-col items-center justify-center w-full text-center min-h-96 h-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
            About {MetaData.title}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
        MangoLens is a Progressive Web App (PWA) that helps detect diseases on mango leaves by simply capturing an image. It provides instant and accurate diagnoses, making it easier for farmers and growers to protect their crops anytime, anywhere, even offline.
        </p>
        <div className="flex gap-4">
        </div>
      </div>
    </SectionWrapper>
  );
}
