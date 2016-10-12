"use strict";

var todo = {
	data: null,
	cy: null,
	
	add_event: function(html_element, event_name, event_function) {
		if (html_element.addEventListener) { // Modern
			html_element.addEventListener(event_name, event_function, false);
		} else if (html_element.attachEvent) { // Internet Explorer
			html_element.attachEvent("on" + event_name, event_function);
		} else { // others
			html_element["on" + event_name] = event_function;
		}
	},
	
	json_get: function(path, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			callback(request);
		}
		
		request.open('GET', path);
		request.send();
	},
	
	init_graph: function(todo_data) {
		//console.log(todo_data.elements)
		// -- initialize cytoscape --
		this.cy = cytoscape({
			container: document.getElementById('lower'), // container to render in
		
			elements: todo_data.elements,
		
			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: {
						'background-color': function( ele ){
							if (ele.data('bgcol'))
								return ele.data('bgcol')
							return "#DDD"
						},
						'label': 'data(label)'
					}
				},

				{
					selector: 'edge',
					style: {
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
						'target-arrow-shape': 'triangle',
						'curve-style': 'unbundled-bezier',
						'opacity': 0.666,
						//'width': 'mapData(strength, 70, 100, 2, 6)',
						'width': 3
					}
				}
			],
		
			layout: {
				name: 'cose',
				padding: 10,
				randomize: true,
				//roots: '#1'
			}
		});

		// -- initialize the context menu --
		// the default values of each option are outlined below:
		var defaults = {
			menuRadius: 100, // the radius of the circular menu in pixels
			selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
			commands: [ // an array of commands to list in the menu or a function that returns the array
				{ // example command
					fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
					content: 'Add', // html/text content to be displayed in the menu
					select: function(ele) { // a function to execute when the command is selected
						//console.log( "add: " + ele.id() ) // `ele` holds the reference to the active element
						todo.node_add(ele);
					},
					disabled: false // disables the item on true
				}, 
				{ // example command
					fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
					content: 'Edit', // html/text content to be displayed in the menu
					select: function(ele){ // a function to execute when the command is selected
						//console.log( "edit: " + ele.id() ) // `ele` holds the reference to the active element
						todo.node_edit(ele);
					},
					disabled: false // disables the item on true
				}, 
				{ // example command
					fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
					content: 'Delete', // html/text content to be displayed in the menu
					select: function(ele){ // a function to execute when the command is selected
						//console.log( "delete: " + ele.id() ) // `ele` holds the reference to the active element
						todo.node_delete(ele);
					},
					disabled: false // disables the item on true
				}, 
			], // function( ele ){ return [ /*...*/ ] }, // example function for commands
			fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
			activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
			activePadding: 20, // additional size in pixels for the active command
			indicatorSize: 24, // the size in pixels of the pointer to the active command
			separatorWidth: 3, // the empty spacing in pixels between successive commands
			spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
			minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
			maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
			openMenuEvents: 'cxttapstart taphold', // cytoscape events that will open the menu (space separated)
			itemColor: 'white', // the colour of text in the command's content
			itemTextShadowColor: 'black', // the text shadow colour of the command's content
			zIndex: 9999, // the z-index of the ui div
			atMouse: false // draw menu at mouse position
		};
	
		var cxtmenuApi = this.cy.cxtmenu(defaults);
	
		/*
		// the default values of each option are outlined below:
		var defaults = {
			zoomFactor: 0.05, // zoom factor per zoom tick
			zoomDelay: 45, // how many ms between zoom ticks
			minZoom: 0.1, // min zoom level
			maxZoom: 10, // max zoom level
			fitPadding: 50, // padding when fitting
			panSpeed: 10, // how many ms in between pan ticks
			panDistance: 10, // max pan distance per tick
			panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
			panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
			panInactiveArea: 8, // radius of inactive area in pan drag box
			panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
			zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
			fitSelector: undefined, // selector of elements to fit
			animateOnFit: function(){ // whether to animate on fit
				return false;
			},
			fitAnimationDuration: 1000, // duration of animation on fit

			// icon class names
			sliderHandleIcon: 'fa fa-minus',
			zoomInIcon: 'fa fa-plus',
			zoomOutIcon: 'fa fa-minus',
			resetIcon: 'fa fa-expand'
		};

		cy.panzoom(defaults);
		*/
	},

	init: function() {
		function req_handler(request) {
			if(request.readyState === 4) {
				if (request.status === 200) {
					todo.data = JSON.parse(request.responseText);
					//console.log(todo.data)
					todo.init_graph(todo.data);
				} else {
					// FIXME: handle http errors
					console.log('An error occurred during your request: ' + request.status + ' ' + request.statusText);
				}
			}
		}
		todo.json_get("/_/get/cy", req_handler);
	},
	
	log: function(msg) {
		console.log(msg)
	},
	
	node_add: function(ele) {
		// console.log(ele.id());
		// ask for name
		//var name = prompt("Task", "");

		if (name == null)
			return false;	
		
		console.log(this.cy)
		var nb = ele.neighborhood()
		/*nb.each(function(i, ele) {
			if (!ele.isEdge())
				continue;
			
		})*/
		todo.log()
		todo.log("New name: " + name)
		// get parent
		// show throbber
		// send request
			// upon success, add node client side
			// upon error show message
		// remove throbber
	},
	
	node_edit: function(ele) {
		console.log(ele.data("parent"));
	},
	
	node_delete: function(ele) {
		console.log(ele.id());
	},
}

todo.add_event(window, "load", todo.init);
