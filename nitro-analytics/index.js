const express = require("express");
const app = express();
const cors = require("cors");
const Event = require("./Models/Event");
const EventType = require("./Models/EventType");
const port = 3000;

app.use(cors("*"));
app.use(express.static("Tools"));

app.post("/analytic-event", (req, res) => {
  // set the URL to something unintuitive to prevent adblockers from blocking the request. This url would definitely get flagged by an adblocker.
  let eventTypeSlug = req.query.ev;
  let eventType = new EventType().getBySlug(eventTypeSlug);
  let event = {
    event_type_id: eventType.id,
  };

  try {
    new Event().create(event);
    return res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
