import WaveAnimation from "@/components/Hallofwaves";

export default function LayoutPage({children}:{children:React.ReactNode}) {
    return (
        <div>
           <div className=" relative">
           <WaveAnimation /> 
              {children}
           </div>
        </div>
    );
}