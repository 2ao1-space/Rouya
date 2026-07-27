import { useQuery } from "@tanstack/react-query";
import { fetchPrayerTimes, PrayerTimings } from "@/lib/prayerTimesApi";
import { useLocation } from "@/hooks/useLocation";
import { toDateKey } from "@/lib/habits";

export function usePrayerTimes(date: Date) {
  const { data: location } = useLocation();
  const dateKey = toDateKey(date);

  return useQuery({
    queryKey: ["prayerTimes", dateKey, location?.latitude, location?.longitude],
    enabled: Boolean(location),
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async (): Promise<PrayerTimings> => {
      return fetchPrayerTimes(date, location!.latitude, location!.longitude);
    },
  });
}
