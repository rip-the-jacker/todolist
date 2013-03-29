from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$','todolist.views.index'),
    url(r'^todolist/$','todolist.views.index'),
    url(r'^todos/(?P<todo_id>\d+)/$','todolist.views.todos'),
    url(r'^todos/$','todolist.views.todos'),
)
