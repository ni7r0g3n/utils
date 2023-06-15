class Analytics {
  event(eventType) {
    fetch(env.ENDPOINT_URL, eventType, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
