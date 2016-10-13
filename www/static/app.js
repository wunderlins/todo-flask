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
	
	/**
	 * send xmlhttp request
	 * 
	 * Arguments
	 * - path String - request url
	 * - callback function - callback(request), request will hold an XMLHttpRequest.request object
	 * - headers array - 2 dimensional array of request headers
	 * - method String - the request method: "GET", "POST", "PUT", "DELETE", etc. 
	 * - body String - the POST/PUT body, unused otherwise
	 */
	request: function(path, callback, headers, method, body) {
		// optional function arguments
		if (typeof method  === 'undefined') method  = 'GET';
		if (typeof body    === 'undefined') body    = null;
		if (typeof headers === 'undefined') headers = [];
		
		// create request and set callback
		var request = new XMLHttpRequest();
		
		function req_handler(request) {
			if(request.readyState === 4) {
				if (request.status === 200) {
					callback(request.responseText, request);
				} else {
					console.log('request error: ' + request.status + ' ' + request.statusText);
				}
			}
		}
		
		request.onreadystatechange = function() {
			callback(request);
		}
		
		// open connection
		request.open(method, path, true);
		
		// set request headers
		for (var i=0; i < headers.length; i++) {
			var h = headers[i];
			request.setRequestHeader(h[0], h[1]);
		}
		
		// send request
		if ((method == "POST" || method == "PUT") && body !== null)
			request.send(body);
		else
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
				animate: true,
				randomize: true,
				//roots: '#1',
				// Node repulsion (overlapping) multiplier
				nodeOverlap: 10,
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
		todo.request("/_/get/cy", req_handler);
	},

	get_parent: function(ele) {
		var parent = null;
		var nb = ele.neighborhood("node")
		nb.each(function(i, e) {
			if (!e.isEdge()) {
				var edgto = e.edgesTo(ele).id()
				//console.log(e.edgesTo(ele).parent())
				if (edgto) {
					var a = edgto.split(".")
					var pid = parseInt(a[0].substr(1))
					parent = todo.cy.nodes("#n"+pid)
					//console.log(p)
				}
			}
			
		});
		
		return parent;
	},
	
	log: function(msg) {
		console.log(msg)
	},
	
	node_add: function(ele) {
		// console.log(ele.id());
		// ask for name
		var name = prompt("Task", "");

		if (name == null)
			return false;	
		
		// TODO: show throbber
		
		var id = parseInt(ele.id().substr(1));
		console.log(id)
		
		
		// send request
		var path   = "/_/set/cy";
		var header = [["Content-Type", "application/json;charset=UTF-8"]];
		var method = "POST";
		var body   = JSON.stringify({name: name, parent: id});
		var callback = function(request) {
			if(request.readyState === 4) {
				console.log(request.status)
				if (request.status === 200) {
					var response = JSON.parse(request.responseText);
					/*
					todo.cy.$('#'+response.elements[0].data.id).position()
					
					FIXME: this is ugly, but positioning manually seems ways to 
					       time consuming, so we just reload
					*/
					
					// TODO: this is an example how to align nodes
					//todo.cy.add(response.elements);
					//todo.cy.collection("[id = '#"+response.elements[0].data.id+"']").makeLayout({name: "cose"}).run()
					
					todo.init();
					console.log(response);
				} else {
					// FIXME: handle http errors
					console.log('An error occurred during your request: ' + request.status + ' ' + request.statusText);
				}
			}
		}
		todo.request(path, callback, header, method, body);
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
