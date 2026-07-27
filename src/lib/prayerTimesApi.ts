export interface PrayerTimings {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const CALCULATION_METHOD = 5;

export async function fetchPrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
): Promise<PrayerTimings> {
  const timestamp = Math.floor(date.getTime() / 1000);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const url = new URL(`https://api.aladhan.com/v1/timings/${timestamp}`);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("method", String(CALCULATION_METHOD));
  url.searchParams.set("timezonestring", timezone);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("فشل جلب مواقيت الصلاة");

  const json = await response.json();
  const timings = json.data.timings;

  const clean = (value: string) => value.split(" ")[0];

  return {
    fajr: clean(timings.Fajr),
    dhuhr: clean(timings.Dhuhr),
    asr: clean(timings.Asr),
    maghrib: clean(timings.Maghrib),
    isha: clean(timings.Isha),
  };
}
