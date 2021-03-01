const allPorts = [];

onconnect = (e) => {
  const port = e.ports[0];
  allPorts.push(port);

  port.onmessage = (e) => {
    allPorts
      .filter((item) => item !== port)
      .forEach((port) => {
        port.postMessage(e.data);
      });
  };
};
