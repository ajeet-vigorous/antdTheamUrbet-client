const domainSettings = {
  "vet69.com": {
    title: "VET69",
    favicon: "/favicon.ico",
    logo: "/assets/images/logo.png",
    SOCKET_URL: "https://socket.trovetown.co/",
    apiurl: "https://api.vet69.com/v1/",
    domainName: "VET69",
    websiteName: "VET69.COM",
    "--nav-dark-bg": "linear-gradient(#008080 0%, #060A2A 100%)",
    "--nav-dark-bg-revers": "linear-gradient(#060A2A 0%, #008080 100%)",

    socketDomain: "vet69.com",
    noFancyMatchDetails: true,
    internationalCasino: true,
    sportFlag: true,
    virtuleGame: true,
    demoCredentials: {
      username: "Demo1",
      password: "1122",
      isClient: true,
      host: window.location.host,
    }

  },
  "drx100.com": {
    title: "DRX100",
    favicon: "/favicon.ico",
    logo: "/assets/images/logodrx.png",
    SOCKET_URL: "https://socket.trovetown.co/",
    apiurl: "https://api.vet69.com/v1/",
    domainName: "DRX100",
    sportFlag: false,
    websiteName: "DRX100.COM",
    socketDomain: "drx100.com",
    "--nav-dark-bg": "linear-gradient(90.01deg, #186161 0.01%, #2F4F4F 99.99%)",
    "--nav-dark-bg-revers": "linear-gradient(#2F4F4F 0%, #186161 100%)",
    noFancyMatchDetails: true,
    internationalCasino: false,
    virtuleGame: false,
    demoCredentials: {
      username: "Demo2",
      password: "1122",
      isClient: true,
      host: window.location.host,
    }

  },

  "plx99.com": {
    title: "PLX99",
    favicon: "/favicon.ico",
    logo: "/assets/images/plx99.png",
    SOCKET_URL: "https://socket.trovetown.co/",
    apiurl: "https://api.drx100.com/v1/",
    domainName: "PLX99",
    websiteName: "PLX99.COM",
    "--nav-dark-bg": "linear-gradient(#22a36d 0%, #060A2A 100%)",
    "--nav-dark-bg-revers": "linear-gradient(#060A2A 0%, #22a36d 100%)",
    socketDomain: "drx100.com",
    noFancyMatchDetails: true,
    internationalCasino: true,
    sportFlag: true,
    virtuleGame: true,
    demoCredentials: {
      username: "Demo1",
      password: "1122",
      isClient: true,
      host: window.location.host,
    }

  },

  "plxwin.com": {
    title: "PLXWIN",
    favicon: "/favicon.ico",
    logo: "/assets/images/plxwin.png",
    SOCKET_URL: "https://socket.trovetown.co/",
    apiurl: "https://api.plxwin.com/v1/",
    domainName: "PLXWIN",
    sportFlag: false,
    websiteName: "PLXWIN.COM",
    socketDomain: "plxwin.com",
    "--nav-dark-bg": "linear-gradient(90.01deg, #186161 0.01%, #2F4F4F 99.99%)",
    "--nav-dark-bg-revers": "linear-gradient(#2F4F4F 0%, #186161 100%)",
    noFancyMatchDetails: true,
    internationalCasino: false,
    virtuleGame: false,
    demoCredentials: {
      username: "Demo2",
      password: "1122",
      isClient: true,
      host: window.location.host,
    }

  },



  "defult": {
    title: "",
    favicon: "/favicon.ico",
    logo: "/assets/images/plx.png",
    SOCKET_URL: "https://socket.trovetown.co/",
    apiurl: "https://api.plxwin.com/v1/",
    domainName: "",
    websiteName: "",
    "--nav-dark-bg": "linear-gradient(#008080 0%, #060A2A 100%)",
    "--nav-dark-bg-revers": "linear-gradient(#060A2A 0%, #008080 100%)",
    socketDomain: "plxwin.com",
    noFancyMatchDetails: true,
    internationalCasino: true,
    sportFlag: true,
    virtuleGame: true,
    demoCredentials: {
      username: "Demo1",
      password: "1122",
      isClient: true,
      host: window.location.host,
    }

  },
};

const domain = window.location.host;
const settings = domainSettings[domain] || domainSettings["defult"];

Object.entries(settings).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

export default settings;