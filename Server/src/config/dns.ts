import dns from "node:dns";

// Avoid SRV lookup failures from restricted local DNS resolvers.
export const configureDNS = (): void => {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
};
