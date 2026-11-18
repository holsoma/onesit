export const site = {
  name: "OneSIT",
  url: import.meta.env.VITE_SITE_URL || "https://onesit.vercel.app",
  repository: "https://github.com/holsoma/onesit",
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
        "Reviewed events and activities for the SIT community, with dates and source links.",
    },
    "/more": {
      title: "Your OneSIT",
      description:
        "Personalise academic dates, manage local preferences and learn about OneSIT.",
    },
    "/about": {
      title: "About OneSIT",
      description:
        "An open-source, student-led app piloted by a member of SIT Vanguard. Not affiliated with SIT.",
    },
    "/coming-soon": {
      title: "Coming soon",
      description:
        "Food ordering, transport, healthcare, campus facilities and more on the OneSIT roadmap.",
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
