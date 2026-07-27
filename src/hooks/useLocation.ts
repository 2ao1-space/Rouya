import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/auth";

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityLabel: string | null;
}

export function useLocation() {
  return useQuery({
    queryKey: ["userLocation"],
    queryFn: async (): Promise<UserLocation | null> => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from("profiles")
        .select("latitude, longitude, city_label")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      if (!data?.latitude || !data?.longitude) return null;
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        cityLabel: data.city_label,
      };
    },
  });
}

export function useDetectLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation)
            return reject(new Error("المتصفح مش بيدعم تحديد الموقع"));
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
          });
        },
      );

      const userId = await getCurrentUserId();
      const { latitude, longitude } = position.coords;

      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, latitude, longitude });
      if (error) throw error;

      return { latitude, longitude };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userLocation"] }),
  });
}
