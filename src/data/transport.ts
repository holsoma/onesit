export const busStop = { code: "69009", name: "Punggol Coast Interchange", road: "Sentul Walk" };
export const arrivalEndpoint = "https://arrivelah2.busrouter.sg/?id=69009";
export const transportChecked = "2026-11-18";
export const busRoutes = [
  { number: "34", destination: "Changi Airport (loop)", url: "https://go-aheadsingapore.com/bus-services/service-34/" },
  { number: "44", destination: "Changi Airport", url: "https://go-aheadsingapore.com/bus-services/service-44/" },
  { number: "104", destination: "Woodleigh Interchange", url: "https://go-aheadsingapore.com/bus-services/service-104/" },
  { number: "117", destination: "Sembawang Interchange", url: "https://www.sbstransit.com.sg/Service/BusService?ServiceNo=117&ServiceType=Basic" },
  { number: "117M", destination: "Sembawang Interchange", url: "https://www.sbstransit.com.sg/Service/BusService?ServiceNo=117M&ServiceType=Basic" },
  { number: "381", destination: "Punggol Interchange", url: "https://go-aheadsingapore.com/bus-services/service-381/" },
];
export const mrt = {
  code: "NE18",
  name: "Punggol Coast",
  destination: "HarbourFront",
  weekdayFirst: "05:39",
  sundayFirst: "05:59",
  last: "23:25",
  timetableUrl: "https://www.sbstransit.com.sg/first-train-last-train",
  stationUrl: "https://www.sbstransit.com.sg/Service/TrainInformation?Station=PGC&TrainLine=NEL",
};
