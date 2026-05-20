import Banner from "./components/Banner";
import Featured from "./components/Featured";
import Testimonials from "./components/Testimonial";
import WhyChooseUs from "./components/WhyChooseUs";


export default function Home() {
  return (
    <div>
     <Banner/>
     <Featured/>
     <WhyChooseUs/>
     <Testimonials/>
    </div>
  );
}
