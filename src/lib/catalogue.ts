export type CatalogueAction = {
  label: string;
  url: string;
  closesOn?: string;
};
export type CatalogueEntry = {
  id: string;
  title: string;
  organiser: string;
  summary: string;
  when: string;
  where: string;
  poster: string;
  preview: string;
  width: number;
  height: number;
  addedOn: string;
  registrationCloses?: string;
  endDate?: string;
  actions: CatalogueAction[];
};
export type CatalogueSection = {
  id: string;
  title: string;
  entries: CatalogueEntry[];
};

export function currentCatalogue(sections: CatalogueSection[], today: string): CatalogueSection[] {
  const notPast = (date?: string) => !date || date >= today;
  return sections.map(section => {
    let entries = section.entries
      .filter(entry => notPast(entry.registrationCloses) && notPast(entry.endDate))
      .map(entry => ({ ...entry, actions: entry.actions.filter(action => notPast(action.closesOn)) }))
      .filter((entry) => entry.actions.length > 0 || section.id === "announcements");
    if (section.id === "announcements") {
      entries = entries.sort((a, b) => b.addedOn.localeCompare(a.addedOn)).slice(0, 3);
    }
    return { ...section, entries };
  }).filter(section => section.entries.length > 0);
}
