import { getQuery } from "ufo";

const getLocations = (peer: { peers: { values: () => Iterable<{ websocket: { url?: string } }> } }) =>
  Array.from(peer.peers.values()).map((connection) => getQuery(connection.websocket.url!));

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe("visitors");
    const locations = getLocations(peer);
    peer.publish("visitors", JSON.stringify(locations));
    peer.send(JSON.stringify(locations));
  },
  close(peer) {
    peer.unsubscribe("visitors");
    setTimeout(() => {
      peer.publish("visitors", JSON.stringify(getLocations(peer)));
    }, 500);
  },
});
