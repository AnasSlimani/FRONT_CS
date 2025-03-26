"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Test } from "@/components/home/SignUpForm";

export default function Partnership() {
  return (
    <div id="joinus" className="min-h-[50rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased py-12">
      <div className="container mx-auto z-10 relative px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Left column - Text content */}
          <div className="flex flex-col justify-center p-4 md:p-8 order-2 lg:order-1">
            <h1 className="text-3xl md:text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-bold mb-4">
              Become a Member of Our Sports Club
            </h1>
            <p className="text-neutral-400 max-w-lg my-4 text-sm md:text-base">
              Join our vibrant sports community and take part in exciting
              tournaments, training sessions, and club events throughout the
              year. Whether you're a beginner or an experienced athlete, our
              club offers an inclusive environment where passion meets
              performance. Fill out the form and start your journey with us
              today!
            </p>
          </div>

          {/* Right column - Test component */}
          <div className="flex justify-center lg:justify-end p-4 order-1 lg:order-2">
            <Test />
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
