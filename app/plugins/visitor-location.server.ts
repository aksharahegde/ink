export default defineNuxtPlugin(() => {
  const event = useRequestEvent();
  const cf = event?.context?.cf as { latitude?: string; longitude?: string } | undefined;

  useState("visitor-location", () => ({
    latitude: Number(cf?.latitude ?? Math.random() * 180 - 90),
    longitude: Number(cf?.longitude ?? Math.random() * 360 - 180),
  }));
});
