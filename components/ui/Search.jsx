import React, { Component, PropTypes } from 'react';


export default class Search extends Component {

	constructor(props) {
		super(props);
		this.createLocations = this.createLocations.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.trackArtistSearch = this.trackArtistSearch.bind(this);
		this.getArtistId = this.getArtistId.bind(this);
		this.getArtistCalendar = this.getArtistCalendar.bind(this);
	}

	createLocations(eventsArray) {
		var latLong = [];
		var content = [];
		var eventsCount = eventsArray.length;
		for (var i = 0; i <= eventsCount - 1; i++) {
			var eventTitle = eventsArray[i].displayName;
			var eventCity = eventsArray[i].location.city;
			var eventDate = eventsArray[i].start.date;
			var eventTime = eventsArray[i].start.time
			var eventUrl = eventsArray[i].uri;
			var eventVenue = eventsArray[i].venue.displayName;

			var indLatLng = {
				lat: eventsArray[i].location.lat,
				lng: eventsArray[i].location.lng
			};
			var indContent = {
				eTitle: eventTitle,
				eCity: eventCity,
				eDate: eventDate,
				eTime: eventTime,
				eUrl: eventUrl,
				eVenue: eventVenue
			}

			latLong.push(indLatLng);
			content.push(indContent);
		}

		return this.props.setupMarkers(latLong, content);
	}

	getArtistId(artist, callback) {
		Meteor.call('fetchArtistId', artist, function (err, res) {
			if (err) {
				return err;
			} else {
				if (!res.data.resultsPage.results.artist) {
					Materialize.toast(artist + ' Cannot Be Found', 10000);
				} else {
					callback(res.data.resultsPage.results.artist[0].id, artist);
				}
			}
		});
	}

	getArtistCalendar(id, callback, artistName) {
		return Meteor.call('fetchArtistCalendar', id, function (err, res) {
			if (err) {
				return err;
			} else {
				if (!res.data.resultsPage.results.event) {
					Materialize.toast(artistName + ': Not On Tour', 10000);
				} else {
					var calendarData = JSON.parse(res.content);
					callback(calendarData.resultsPage.results.event);
				}
			}
		});
	}

	handleSubmit(e) {
		var self = this;
		var artist = this.state.artist;
		e.preventDefault();
		this.trackArtistSearch(artist);
		this.getArtistId(artist, function (id) {
			self.getArtistCalendar(id, function (eventsArray) {
				self.createLocations(eventsArray);
			}, artist);
		});
	}

	handleChange(e) {
		if (e.target.value != "") {
			this.setState({ artist: e.target.value })
		} else {
			Materialize.toast('You must enter an artist', 10000);
		}
	}

	searchTransition() {
		var hasClass = false;
  	document.getElementsByClassName('former')[0].classList.add('transitionOut');
  	setTimeout(function() {
  		document.getElementsByClassName('background')[0].classList.add('zoomIn');
  	},2000);
    setTimeout(function() {
    	document.getElementsByClassName('background')[0].classList.add('displayNone');
    	hasClass = true;
    }, 4000);


		if (hasClass = true) {
			document.getElementsByClassName('material-icons')[0].classList.toggle("searchClick");
			document.getElementsByClassName('close')[0].classList.toggle('searchClick');
		}

	}

	trackArtistSearch(artist) {
		window.dataLayer.push({
		  event: 'artistSearch',
		  artist_search: artist
		});
	}

  render() {
    return (
      <div className="former opener">
      	<div className="wrapped_form">
	      	<h3 className="search-title" >Follow the trail of your favorite artists!</h3>
	      	<form onSubmit={this.handleSubmit}>
	      	<div className="input-field col s6">
		        <input type='text' placeholder="Enter Artist" onChange={this.handleChange}/>
		      </div>
		        <input type="submit" className="big-button" defaultValue='enter'
		        	onClick={this.searchTransition} />
		      </form>
		    </div>
      </div>
    );
  }
}

Search.propTypes = {
	setupMarkers: React.PropTypes.func
};
