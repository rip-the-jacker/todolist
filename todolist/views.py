import json

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from todolist.decorators import json_response
from todolist.models import TodoItem

@csrf_exempt
@json_response
def todos(request, todo_id=0):
	response = {}
	if request.method == 'GET':
		if not todo_id:
			response = []
			todos = TodoItem.objects.all()
			for todo in todos:
				response.append(todo.get_values())
			return response
		else:
			todo = TodoItem.objects.get(id=todo_id)
			response.update(todo.get_values())
	
	elif request.method == 'POST':
		todo = TodoItem()
		values = json.loads(request.read())
		todo.set_values(values)
		response.update(todo.get_values())

	elif request.method == 'PUT' :
		todo = TodoItem.objects.get(id=todo_id)
		values = json.loads(request.read())
		todo.set_values(values)
	
	response['success'] = True
	return response

def index(request):
	return render_to_response('todolist/index.html',{},context_instance=RequestContext(request))
