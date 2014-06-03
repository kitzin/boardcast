function Login(form) {
	this.$form = form;
	this.$inputs = form.find("input");
	this.$submit = this.$inputs.find("[name='submit']");
	this.$message = form.find(".message");
	this.validation = {
		username: {
			identifier: "username",
			rules: [
				{
					type: "empty",
					prompt: "Please enter a username"
				}
			]
		},
		password: {
			identifier: "password",
			rules: [
				{
					type: "empty",
					prompt: "Please enter a password"
				}
			]
		}
	};
	
	this.applyValidation = function() {
		var self = this;
		this.$form.form(this.validation, {
			on: "blur",
			inline: true,
			onSuccess: function(e) {
				e.preventDefault();
				self.validated();
			}
		});
	}
	
	this.validated = function() {
		var serialized = {},
			self = this;
		
		self.$submit.attr("disabled", true);
		
		this.$inputs.each(function() {
			var $this = $(this);
			serialized[$this.attr("name")] = $this.val();
		});
		
		this.$form.addClass("loading");
		
		$.ajax({
			url: "/action/login",
			type: "POST",
			data: serialized,
			error: function() {
				self.error("Error!", "Something unexpected happned!");
				self.$form.find("input[name='submit']").attr("disabled", false);
			},
			success: function(data) {
				self.$submit.attr("disabled", false);
				self.$form.removeClass("loading");
				self.success($.parseJSON(data));
			}
		});
	}
	
	this.success = function(data) {
		if(data.error.code === 0 && data.data.success === true) {
			this.error("Yey!", "You have successfully been logged in and will be redirected to the app.", true);
			setTimeout(function() {
				window.location.href = "http://dotkitti.se/app";
			}, 2000);
		}
		else {
			this.error("Error!", data.error.message);
		}
	}
	
	this.error = function(header, text, success) {
		var self = this,
			cont = function() {
				if(success)
					self.$message.removeClass("red").addClass("green");
				
				self.$message.find(".header").text(header);
				self.$message.find("p").text(text);
				
				if(self.$message.is(":hidden")) {
					self.$message.show(100);
				}
			};
			
		if(this.$message.is(":visible") && this.$message.hasClass("red") && success === true)
			this.$message.hide(100, function() { cont(); });
		else
			cont();
	}
}

$(function() {
	$(".ui.checkbox").checkbox();
	$('.message .close').on('click', function() {
	  $(this).closest('.message').hide(100);
	});
	
	var login = new Login($(".ui.form"));
	login.applyValidation();
});