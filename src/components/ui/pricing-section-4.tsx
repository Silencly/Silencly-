"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free Starter",
    description: "Excellent for lightweight users looking to convert unorganized daily thoughts.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    includes: [
      "Plan includes:",
      "10 dictation runs per day",
      "Standard formatting & tone choices",
      "Local transcription history drawer"
    ],
    excludes: [
      "No custom style presets"
    ]
  },
  {
    name: "Pro Workspace",
    description: "For creators, researchers, and professional builders demanding absolute typing speed.",
    price: 10,
    yearlyPrice: 8,
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Free, plus:",
      "Unlimited transcriptions & polishing",
      "Premium, high-speed priority servers",
      "Fully customizable tone and style presets",
      "Shared Custom Dictionary (Unlimited vocabulary)",
      "Multi-device cloud secure history backup"
    ],
    excludes: []
  }
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-zinc-800 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs font-bold",
            selected === "0" ? "text-zinc-50" : "text-zinc-500",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors text-xs font-bold",
            selected === "1" ? "text-zinc-50" : "text-zinc-500",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Annually <span className="bg-zinc-800 text-zinc-300 text-[9px] font-mono px-1.5 py-0.5 rounded-full z-20">Save 20%</span></span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection({ onAuthClick }: { onAuthClick: () => void }) {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <section
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden pt-20 pb-28 border-t border-zinc-900 w-full"
      ref={pricingRef}
      id="pricing"
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full pointer-events-none"
            style={{
              border: "200px solid #3131f5",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 1"
          ></div>
        </div>
      </TimelineContent>

      <article className="text-center mb-6 max-w-3xl mx-auto space-y-2 relative z-50">
        <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-50 uppercase bg-black border border-zinc-800 px-3 py-1 rounded-full mb-4 inline-block">
          Simple Pricing
        </span>
        <h2 className="text-4xl font-extrabold font-display text-white tracking-tight">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Transparent, Flexible Plans
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-zinc-400 mt-3 font-light leading-relaxed max-w-xl mx-auto"
        >
          Start dictating for free today. Upgrade anytime as your transcription needs expand.
        </TimelineContent>

        <div className="pt-8 pb-4">
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <PricingSwitch onSwitch={togglePricingPeriod} />
          </TimelineContent>
        </div>
      </article>

      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #206ce8 0%, transparent 70%)`,
          opacity: 0.2,
          mixBlendMode: "multiply",
        }}
      />

      <div className="grid md:grid-cols-2 max-w-4xl gap-8 py-6 mx-auto relative z-10 px-6">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-white border-zinc-800 h-full flex flex-col ${
                plan.popular
                  ? "bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 shadow-[0px_0px_100px_0px_rgba(9,0,255,0.15)] z-20 border-blue-900/50"
                  : "bg-zinc-950 z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <div className="bg-blue-600 text-white text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-left flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold tracking-tight mb-2 font-mono uppercase">{plan.name}</h3>
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-extrabold text-zinc-50">
                    ${plan.price === 0 ? "0" : (isYearly ? plan.yearlyPrice : plan.price)}
                  </span>
                  <span className="text-xs text-zinc-500 ml-1 font-mono">
                    {plan.price === 0 ? "/ forever" : `/ month, billed ${isYearly ? "annually" : "monthly"}`}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-4 font-light leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col">
                <button
                  onClick={onAuthClick}
                  className={`w-full mb-8 py-3.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-900/50 border border-blue-500 text-white hover:from-blue-600 hover:to-blue-700 active:scale-[0.98]"
                      : "bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-50 active:scale-[0.98]"
                  }`}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <h4 className="font-semibold text-xs text-zinc-50 mb-4">{plan.includes[0]}</h4>
                  <ul className="space-y-3">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-zinc-50 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-300">{feature}</span>
                      </li>
                    ))}
                    {plan.excludes.map((feature, featureIndex) => (
                      <li key={`ex-${featureIndex}`} className="flex items-start gap-3 opacity-60">
                        <X className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
                        <span className="text-xs text-zinc-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </section>
  );
}
