import {
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
  } from "@radix-ui/react-icons";
  import { BlurFade } from "@/components/magicui/blur-fade";
  import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
  
  const features = [
    {
      Icon: FileTextIcon,
      name: "Save your files",
      description: "We automatically save your files as you type.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="https://startup-template-sage.vercel.app/hero-dark.png" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: InputIcon,
      name: "Full text search",
      description: "Search through all your files in one place.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="https://startup-template-sage.vercel.app/hero-dark.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: GlobeIcon,
      name: "Multilingual",
      description: "Supports 100+ languages and counting.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="https://startup-template-sage.vercel.app/hero-dark.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: CalendarIcon,
      name: "Calendar",
      description: "Use the calendar to filter your files by date.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="https://startup-template-sage.vercel.app/hero-dark.png" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: BellIcon,
      name: "Notifications",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="https://startup-template-sage.vercel.app/hero-dark.png" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
  
  export function BentoDemo() {
    return (
        <BlurFade>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
      </BlurFade>
    );
  }
  