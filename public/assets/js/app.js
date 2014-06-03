function BAjax(url) {
	this.type = "POST";
	this.url = url;
	
	this.sendClean = function(cb, vThis) {
		if(!vThis) vThis = this;
		$.ajax({
			url: this.url,
			type: this.type,
			success: function(data) {
				console.log(data);
				var pdata = $.parseJSON(data);
				if(pdata.error.code !== 0) {
					var modal = new Modal("ERROR!");
					modal.display(pdata.error.message);
				} else {
					cb.apply(vThis, [pdata.data]);
				}
			},
			error: function() {
				var modal = new Modal("ERROR!");
				modal.display("Something unexpected happend!");
			}
		});
	};
	this.send = function(data, cb, vThis) {
		if(!vThis) vThis = this;
		$.ajax({
			url: this.url,
			type: this.type,
			data: data,
			success: function(data) {
				var pdata = $.parseJSON(data);
				if(pdata.error.code !== 0) {
					var modal = new Modal("ERROR!");
					modal.display(pdata.error.message);
				} else {
					cb.apply(vThis, [pdata.data]);
				}
			},
			error: function() {
				var modal = new Modal("ERROR!");
				modal.display("Something unexpected happend!");
			}
		});
	};
}

/*function Template() {}
Template.prototype.getTemplate = function(element) {
	return _.template(element.html());
}

function inheir(base, supah) {
	base.prototype = supah.prototype;
}

function Message() {
	this.message = "";
	this.nickname = "";
	this.image = "";
	this.rsa = { c: 0, n: 0 };
	
	this.template = this.getTemplate($("#template_i_dont_really_know_the_id"));
}

inheir(Message, Template);


function Listener(url, timeout) {
	this.timeout = timeout;
	this.ajax = new BAjax(url);
	
	this.actions = {};
	
	var self = this;
	this.f = function() {
		self.interval();
		self.t = setTimeout(self.f, self.timeout);
	};
}
Listener.prototype.interval = function() {
	this.ajax.send({ time: +new Date }, function(data) {		
		data = $.parseJSON(data);
		_.each(data, function(item) {
			self.trigger(item.action, item);
		});
	}, this);
}
Listener.prototype.start = function() {
	this.f();
}
Listener.prototype.on = function(action, fn) {
	if(!this.actions[action])
		this.actions[action] = [];
		
	this.actions[action].push(fn);
}
Listener.prototype.trigger = function(action, data) {
	var actions = this.actions[action];
	if(actions) {
		for(var i = 0; i<actions.length; i++) {
			actions[i](data);
		}
	}
}

function App() {
	this.initialize = function() {
		this.container = {
			chat: $("#chats"),
			friends: $("#friends").find(".list.tiny"),
			tabs: $("#chat-tabs > div")
		};
		
		this.template = {
			chat: _.template($("#chat_template").html()),
			friend: _.template($("#friend_template").html()),
			tab: _.template($("#chat_tabs_template").html()),
			message: _.template($("#message_template").html())
		}
		
		this.listen = new Listener("/action/listen/", 5000);
		this.listen.on("message", function(data) { alert("message"); });
		this.listen.on("online_friends", function(data) { alert("online_friends"); });
		//this.listen.start();
	}
	
	this.getOnlineFriends = function() {
		var self = this;
		$.ajax({
			type: "POST",
			url: "/action/online/",
			success: function(data) {
				
			},
			error: function() {
				alert("god dammit!");
			}
		});
	}
	
	this.getConversations = function() {
		var self = this;
		$.ajax({
			type: "POST",
			url: "/action/conversations/",
			success: function(data) {
				
			},
			error: function() {
				alert("god dammit!");
			}
		});
	}
	
	this.initialize();
}*/

function Modal(title) {
	
	if(Modal.el.main === undefined) {
		Modal.el.main = $("#modal");
		Modal.el.text = Modal.el.main.find(".text");
		Modal.el.header = Modal.el.main.find(".header");
	}

	this.title = title;
	this.display = function(text) {
		Modal.el.header.html(this.title);
		Modal.el.text.html(text);
		Modal.el.main.show();
		setTimeout(function() {
			Modal.el.main.hide();
		}, 1000);
	}
}
Modal.el = { main: undefined, text: undefined, header: undefined};

var friends = {
	
	// Render elements
	elements: {
		count: undefined,
		friends: undefined
	},
	
	requests: {
		update: new BAjax("/action/friends"),
		add: new BAjax("/action/addfriend")
	},
	
	eventElements: {
		add: undefined,
	},
	
	// All currently online friends
	friends: [],
	
	// Template for a friend
	template: undefined,
	
	// Adds all the events
	addEvents: function() {
		
		console.log("initializing friend events");
		
		var self = this;
		this.eventElements.add.keyup(function(e) {
			var val = self.eventElements.add.val();
			if(e.keyCode === 13 && val !== "")
				self.addFriend(val);
		});
	},
	
	// Initialize ALL THE STUFF
	initialize: function() {
		
		console.log("initializing friends");
		
		this.template = _.template($("#friend_template").html());
		this.elements.count = $("#online");
		this.elements.friends = $("#friend_list");
		this.eventElements.add = $("#add_friend");
		
		this.addEvents();
	},
	
	// Performs an ajax call to get all the online friends
	updateFriends: function() {
		console.log("updating friends");
		this.requests.update.sendClean(function(data) {
			this.friends = data;
			this.elements.count.html(data.length);
			
			this.elements.friends.children(".friend").remove();
			
			var container = $(document.createDocumentFragment());
			
			var ihtml = "";
			for(var i = 0; i<data.length; i++) {
				var d = data[i],
					ht = $(this.template({ image: d.profile_picture, username: d.username })),
					self = this;
					c = function() {
						self.openConversation(d);
					};
					
					ht.find(".avatar").attr("src", d.profile_picture);
				
				ht.click(c);
				container.append(ht);
			}
			
			this.elements.friends.append(container);
		}, this);
	},
	
	openConversation: function(user) {
		alert(user.id);
		boardcast.conversation.create(user);
	},
	
	// Add a friend
	addFriend: function(name) {
		console.log("trying to add friend");
		this.requests.add.send({ name: name }, function(data) {
			console.log(data);
		}, this);
	}
}

var messages = {
	initialize: function() {
		console.log("initializing messages");
	},
	
	check: function() {
		var a = new BAjax("/action/listen");
		a.sendClean(function(data) {
			
			
			
		});
	}
}

var conversations = {
	
	conversations: [],
	
	initialize: function() {
		console.log("initializing conversations");
	},
	
	create: function(user) {
		
	}
}

var boardcast = {};

boardcast.friends = friends;
boardcast.messages = messages;
boardcast.conversations = conversations;

boardcast.initialize = function(cb) {
	console.log("initializing boardcast");

	this.friends.initialize();
	this.messages.initialize();
	this.conversations.initialize();
	
	boardcast.listen();
}

boardcast.listen = function() {

	var messages = function() {
		boardcast.messages.check();
		setTimeout(messages, 1000);
	};
	
	var friends = function() {
		boardcast.friends.updateFriends();
		setTimeout(friends, 5000);
	}
	
	friends();
	//messages();
}

$(function() {
	var sb = $("#scrollbar"),
		scrollSettings = {
                height: "auto",
                wheelStep: 1,
                start: "bottom"
        };
		
	sb.slimScroll(scrollSettings);
	$(window).resize(function() {
		sb.slimScroll(scrollSettings);
	});
	
	boardcast.initialize();
});
