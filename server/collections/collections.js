import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Artists = new Mongo.Collection('artists');
  Sessions = new Mongo.Collection('sessions');
  TicketClicks = new Mongo.Collection('ticketClicks');
  ArtistSearches = new Mongo.Collection('artistSearches');
}
