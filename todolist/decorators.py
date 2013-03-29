from functools import wraps

from django.utils import simplejson
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings


def json_response(func):
    """json response decorator

    Views that need to send a json response should be wrapped with
    this decorator and must return a dict

    """
    @wraps(func)
    def dec(request, *args, **kwargs):
        response = func(request, *args, **kwargs)
        json = simplejson.dumps(response)
        return HttpResponse(json, mimetype='application/json')
    return dec


def jsonp_response(func):
    """jsonp response decorator
    
    Views that need to respond to a jsonp type of request must be
    wrapped with this decorator and must return a dict

    """
    @wraps(func)
    def dec(request, *args, **kwargs):
        response = func(request, *args, **kwargs)
        assert(isinstance(response, dict))
        json = simplejson.dumps(response)
        jsonp = str(request.GET.get('callback')) + '(' + simplejson.dumps(json) + ')'
        return HttpResponse(jsonp, mimetype='application/javascript')
    return dec               


def only_ajax(func):
    @wraps(func)
    def dec(request, *args, **kwargs):
        if not request.is_ajax() and not settings.DEBUG:
            return HttpResponseBadRequest()
        return func(request, *args, **kwargs)
    return dec

