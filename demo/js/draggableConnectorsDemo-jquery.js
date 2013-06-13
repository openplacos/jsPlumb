;(function() {

	var _initialised = false,
		showConnectionInfo = function(s) {
			$("#list").html(s);
			$("#list").fadeIn({complete:function() { jsPlumb.repaintEverything(); }});
		},	
		hideConnectionInfo = function() {
			$("#list").fadeOut({complete:function() { jsPlumb.repaintEverything(); }});
		},
		connections = [],
		updateConnections = function(conn, remove) {
			if (!remove) connections.push(conn);
			else {
				var idx = -1;
				for (var i = 0; i < connections.length; i++) {
					if (connections[i] == conn) {
						idx = i; break;
					}
				}
				if (idx != -1) connections.splice(idx, 1);
			}
			if (connections.length > 0) {
				var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
				for (var j = 0; j < connections.length; j++) {
					s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
				}
				showConnectionInfo(s);
			} else 
				hideConnectionInfo();
		};
	
	window.jsPlumbDemo = {
		init : function() {
		
			// setup jsPlumb defaults.
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				PaintStyle : { strokeStyle:'#666' },
				EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
				Endpoint : "Rectangle",
				Anchors : ["TopCenter", "TopCenter"]
			});												

			// bind to connection/connectionDetached events, and update the list of connections on screen.
			jsPlumb.bind("connection", function(info, originalEvent) {
				updateConnections(info.connection);
			});
			jsPlumb.bind("connectionDetached", function(info, originalEvent) {
				updateConnections(info.connection, true);
			});

			// configure some drop options for use by all endpoints.
			var exampleDropOptions = {
				tolerance:"touch",
				hoverClass:"dropHover",
				activeClass:"dragActive"
			};

			//
			// first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
			// and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
			// starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
			// that declares 'exampleEndpoint' as its drop scope, and also that
			// only 'exampleConnection' types can be dropped here.
			//
			// the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
			// 5 pixels, and a gradient.
			//
			// there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
			// or not to allow a particular connection to be established.
			//

			//
			// the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
			// and has scope 'exampleConnection2'.
			//
			var colorin = "#316b31";
			var genericinput = {
				endpoint:["Dot", { radius:8 }],
				paintStyle:{ fillStyle:colorin },
				isSource:false,
				scope:"green dot",
				connectorStyle:{ strokeStyle:colorin, lineWidth:6 },
				connector: ["Bezier", { curviness:63 } ],
				maxConnections:1,
				isTarget:true,
				dropOptions : exampleDropOptions
			};

			var colorout = "rgb(55,118,156)";
			var genericoutput = {
				endpoint:["Dot", { radius:8 }],
				paintStyle:{ fillStyle:colorout},
				isSource:true,
				scope:"green dot",
				connectorStyle:{ strokeStyle:colorout, lineWidth:6 },
				connector: ["Bezier", { curviness:63 } ],
				maxConnections:1,
				isTarget:false,
				dropOptions : exampleDropOptions
			};


			// setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
			// of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)

		    function computeSize(name,nIn,nOut) {
					document.getElementById(name).style.height = (25*(Math.max(nIn,nOut)+1)/0.8) + "px";	
					outputsPos = [];
					for(var i=0;i<nOut;i++){
						outputsPos.push([1, 0.1 + (i+1)*(0.8/(nOut+1)),1,0]);
					}
					inputsPos = [];
					for(var i=0;i<nIn;i++){
						inputsPos.push([0, 0.1 + (i+1)*(0.8/(nIn+1)),-1,0]);
					}
					return [inputsPos, outputsPos];
				}
				
				var anchors = computeSize("virtualplacos",5,3);
				//console.log(anchors);
				for(var i=0;i< anchors[0].length; i++){
					jsPlumb.addEndpoint("virtualplacos", { anchor: anchors[0][i] }, genericinput);
				};
				
				for(var i=0;i< anchors[1].length; i++){
					jsPlumb.addEndpoint("virtualplacos", { anchor: anchors[1][i] }, genericoutput);
				};
				
		    // input Vplacos
		    

		    jsPlumb.addEndpoint("temperature", { anchor:[1, 0.5, 1, 0] }, genericoutput);
		    var e4 = jsPlumb.addEndpoint("temperature", { anchor:[0, 0.5, -1, 0] }, genericinput);


			// make .window divs draggable
			jsPlumb.draggable($(".window"));
			

			// add endpoint of type 3 using a selector. 
			//jsPlumb.addEndpoint($(".window"), exampleEndpoint3);

			//			
			if (!_initialised) {
				$(".hide").click(function() {
					jsPlumb.toggleVisible($(this).attr("rel"));
				});
	
				$(".drag").click(function() {
					var s = jsPlumb.toggleDraggable($(this).attr("rel"));
					$(this).html(s ? 'disable dragging' : 'enable dragging');
					if (!s)
						$("#" + $(this).attr("rel")).addClass('drag-locked');
					else
						$("#" + $(this).attr("rel")).removeClass('drag-locked');
					$("#" + $(this).attr("rel")).css("cursor", s ? "pointer" : "default");
				});
	
				$(".detach").click(function() {
					jsPlumb.detachAllConnections($(this).attr("rel"));
				});
	
				$("#clear").click(function() { 
					jsPlumb.detachEveryConnection();
					showConnectionInfo("");
				});
				
				_initialised = true;
			}
		}
	};	
})();
