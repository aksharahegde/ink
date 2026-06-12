export type VisitorLocation = {
  latitude: number;
  longitude: number;
};

type VisitorLocationPayload = {
  latitude: string;
  longitude: string;
};

const parseLocations = (payload: string) => {
  const parsed = JSON.parse(payload) as VisitorLocationPayload[];
  return parsed.map((location) => ({
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  }));
};

export const useVisitorPresence = () => {
  const myLocation = useState<VisitorLocation>("visitor-location");
  const locations = ref<VisitorLocation[]>([]);
  const isConnected = ref(false);

  let socket: WebSocket | undefined;

  const connect = () => {
    if (socket) return;

    const { latitude, longitude } = myLocation.value;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws/visitors?latitude=${latitude}&longitude=${longitude}`;

    socket = new WebSocket(url);

    socket.addEventListener("message", (event) => {
      locations.value = parseLocations(String(event.data));
      isConnected.value = true;
    });

    socket.addEventListener("close", () => {
      isConnected.value = false;
    });
  };

  const disconnect = () => {
    socket?.close();
    socket = undefined;
  };

  const count = computed(() => locations.value.length);

  onMounted(() => {
    const start = () => connect();
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(start, { timeout: 4000 });
    } else {
      setTimeout(start, 2000);
    }
  });

  onBeforeUnmount(disconnect);

  return {
    count,
    locations,
    myLocation,
    isConnected,
  };
};
