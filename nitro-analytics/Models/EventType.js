//make a professional comment documenting the class

/**
 * EventType
 * @class EventType
 * @description An EventType is a group of events that represent an action that can be taken by a user. For example, a user can create an event of type "login" or "logout".
 * @extends Model
 */

const Model = require("./Model");

class EventType extends model {
  table = "event_types";
  fields = ["name", "description", "slug"];
  primaryKey = "id";

  constructor() {
    super();
  }

  getBySlug(slug) {
    return this.where("slug", slug).first();
  }
}
