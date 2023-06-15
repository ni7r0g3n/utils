/**
 * Event
 * @class Event
 * @description An Event is a single action taken by a user. It belongs to a certain EventType.
 * @extends Model
 * @property {object} obj - The object used to initialize the event.
 */

const Model = require("./Model");

class Event extends Model {
  table = "events";
  fields = ["event_type_id", "last"];
  primaryKey = "id";

  constructor(obj) {
    super(Event, obj);
  }
}

module.exports = Event;
