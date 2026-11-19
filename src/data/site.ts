export const site = {
  name: "OneSIT",
  url: import.meta.env.VITE_SITE_URL || "https://onesit.vercel.app",
  repository: "https://github.com/holsoma/onesit",
  feedback: "https://app.sli.do/event/aTFUhNXvYZHENxDvqvCy8N",
  description:
    "Campus services, academic dates and student events in one place. An open-source companion for SIT students.",
  affiliation: "Not affiliated with SIT.",
};
export const pageMeta: Record<string, { title: string; description: string }> =
  {
    "/": { title: "Your campus companion", description: site.description },
    "/services": {
      title: "Services",
      description:
        "Find SIT services, pin your favourites and see what is coming to OneSIT.",
    },
    "/events": {
      title: "What’s Happening",
      description:
        "The What’s Happening newsletter catalogue, with internal and external events, SITeQuests, announcements and posters.",
    },
    "/transport": {
      title: "Punggol transport",
      description: "Bus arrival estimates at Punggol Coast Interchange and official first and last MRT train times towards HarbourFront.",
    },
    "/more": {
      title: "Your OneSIT",
      description:
        "Personalise academic dates, manage local preferences and learn about OneSIT.",
    },
    "/about": {
      title: "About OneSIT",
      description:
        "An open-source companion for campus services, academic dates and student events. Not affiliated with SIT.",
    },
    "/coming-soon": {
      title: "Coming soon",
      description:
        "Food ordering, healthcare, campus facilities and more on the OneSIT roadmap.",
    },
    "/tools/newsletter": {
      title: "Newsletter review",
      description:
        "Review a newsletter on your device and export selected event summaries for OneSIT.",
    },
    "/404": {
      title: "Page not found",
      description:
        "Find your way back to OneSIT campus services, dates and events.",
    },
  };
