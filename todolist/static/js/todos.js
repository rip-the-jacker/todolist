$(function(){

	addcount = 0;
	removecount = 0;
	doneCurrent = true;

	TodoItem = Backbone.Model.extend({
		defaults:{
			description:'Empty todo',
			status:'incomplete'
		},
		urlRoot: '/todos/',
		toggleStatus: function() {
			if(this.get('status')==='incomplete') {
				if(this.get('id')!==5){
					doneCurrent = true;
				}
				this.set('status','complete');
			}
			// else {
			// 	this.set('status','incomplete');
			// }
		},
	});

	TodoView = Backbone.View.extend({
		className: 'todo',
		id: 'todo-list',
		template: _.template('<h2 class="'+
			'<% if(status==="complete") print("checked")%>">'+
			'<img class="checkbox"'+
			'src="/static/images/<% print(status) %>.png">'+
			'<%= description %></h2>'),
		events: {
			'click .checkbox': 'toggleStatus',
		},
		initialize: function () {
			this.model.on('change',this.render, this);
			this.model.on('destroy',this.remove, this);
			this.model.on('hide',this.remove, this);
		},
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		toggleStatus: function() {
			this.model.toggleStatus();
		},
		remove: function () {
			this.$el.remove();
		}
	});

	bonusItem = new TodoItem({description:'Defeat Alexander\'s Army',id:5});
	bonusView = new TodoView({ model: bonusItem});

	TodoList = Backbone.Collection.extend({
		model:TodoItem,
		url: '/todos/',
	});

	todoList = new TodoList();
	TodoListView = Backbone.View.extend({
		initialize: function () {
			this.collection.on('add', this.addOne, this);
			this.collection.on('reset', this.addAll, this);
			this.collection.on('remove',this.hideModel,this);
			$('#todo-list').html(this.$el);
		},

		hideModel:function (model) {
			model.trigger('hide');
		},

		render: function () {
			this.addAll()
		},

		addAll: function () {
			this.collection.forEach(this.addOne, this);
		},

		addOne: function (todoItem) {
			var todoView = new TodoView({model:todoItem});
			this.$el.append(todoView.render().el);
		}
	});

	todoListView = new TodoListView({collection:todoList});
	todoListView.render();

	$('#add').click(function () {
		todoList.add(bonusItem);
		$(this).addClass('invisible');
		$('#remove-one').addClass('dib');
		$('#remove-one').removeClass('hidden');
		removecount++;
	});

	$('#add-next').click(function () {
		if(!doneCurrent) {
			$('#overlay').show()
			return;
		}
		addcount++;
		removecount++;
		if(addcount >= 4 ) {
			$(this).addClass('hidden');
			$(this).removeClass('dib');
		}
		var todoItem = new TodoItem({id:addcount});
		todoItem.fetch({
			success:function () {
				todoList.add(todoItem);
				$('#remove-one').addClass('dib');
				$('#remove-one').removeClass('hidden');
				if(todoItem.get('id')!==5){
					doneCurrent=false;
				}
			}
		});
	});

	$('#remove-one').click(function () {
		removecount--;

		if(removecount < 1) {
			$(this).addClass('hidden');
			$(this).removeClass('dib');
		}
		if(todoList.at(removecount).get('id')!=5) {
			addcount--;
			doneCurrent=true;
		}
		todoList.remove(todoList.at(removecount));
		$('#add-next').addClass('dib');
		$('#add-next').removeClass('hidden');
	});

	$('#overlay').click(function () {
		$(this).hide();
	})

	// function print_id() {
	// 	console.log('new id is',todoItem2.get('id'));
	// }

	// todoItem2 = new TodoItem();
	// todoItem2.set({description:'Fill in prescriptions'});
	// todoItem2.save(
	// 	{},
	// 	{
	// 		success: function (args){
	// 			var id  = args.get('id');
	// 			todoItem2.set('id',id);
	// 			print_id();
	// 		}
	// 	}
	// );
});