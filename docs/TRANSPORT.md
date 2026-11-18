# Punggol transport

`/transport` covers Punggol Coast Bus Interchange (stop 69009, Sentul Walk) and Punggol Coast MRT (NE18). It is available through Services and can be saved as a home shortcut.

## Bus estimates

The browser requests `https://arrivelah2.busrouter.sg/?id=69009`. [ArriveLah](https://github.com/cheeaun/arrivelah) is an open-source proxy for LTA bus arrival data. Its public endpoint supports browser requests and caches responses for 15 seconds. OneSIT needs no API key or backend, but depends on that service being available. Bus data belongs to LTA.

The page fetches on opening and approximately every 30 seconds. It allows manual refresh, stops polling on the MRT tab and when hidden, aborts requests after eight seconds, and resumes on return or reconnection. An in-memory snapshot avoids an empty screen when returning between tabs. It is not saved to localStorage.

The next three absolute timestamps are converted to minutes using the device clock. Durations are rounded down, and less than one minute is shown as Arriving, following the [LTA API guide](https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf). Past timestamps and estimates more than 24 hours away are omitted. After 90 seconds without a successful refresh, countdowns are hidden. A failed request retains the last received time and shows an error rather than claiming that the data is current.

`monitored: 0` is labelled Scheduled. `monitored: 1` is labelled Estimated. Missing estimates are not treated as proof that a bus is out of service. Interchange times commonly come from the operator's timetable.

The listed routes and destinations were checked on 18 November 2026:

| Service | Destination | Source |
| --- | --- | --- |
| 34 | Changi Airport, loop | [Go-Ahead](https://go-aheadsingapore.com/bus-services/service-34/) |
| 44 | Changi Airport | [Go-Ahead](https://go-aheadsingapore.com/bus-services/service-44/) |
| 104 | Woodleigh Interchange | [Go-Ahead](https://go-aheadsingapore.com/bus-services/service-104/) |
| 117 | Sembawang Interchange | [SBS Transit](https://www.sbstransit.com.sg/Service/BusService?ServiceNo=117&ServiceType=Basic) |
| 117M | Sembawang Interchange | [SBS Transit](https://www.sbstransit.com.sg/Service/BusService?ServiceNo=117M&ServiceType=Basic) |
| 381 | Punggol Interchange | [Go-Ahead](https://go-aheadsingapore.com/bus-services/service-381/) |

Additional service numbers returned by the feed are displayed without an invented destination. Update `src/data/transport.ts` when routes change. No geolocation or journey history is collected.

## MRT timetable

[SBS Transit's published timetable](https://www.sbstransit.com.sg/first-train-last-train), checked on 18 November 2026, gives Punggol Coast departures towards HarbourFront as:

| Days | First | Last |
| --- | --- | --- |
| Monday to Saturday | 05:39 | 23:25 |
| Sunday and public holidays | 05:59 | 23:25 |

All times use Singapore time and a 24-hour clock. Special operating hours can differ. The table shows day categories explicitly instead of guessing whether today is a public holiday.

The LTA guide's GTFS Train Trip Updates feed covers disruptions, not routine live arrival predictions. OneSIT therefore does not claim to show a live MRT countdown. The page links to the official timetable and [Punggol Coast station information](https://www.sbstransit.com.sg/Service/TrainInformation?Station=PGC&TrainLine=NEL).

## Checks

Logic tests cover malformed responses, missing timestamps, timetable labels, minute rounding, passed buses, stale data and Singapore time formatting. Browser tests use synthetic API responses to cover refresh, offline recovery, tab and page lifecycle, keyboard access and favouriting. Live feed checks are separate from CI.
