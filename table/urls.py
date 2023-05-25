from django.urls import path
from .views import ajax_get_view, ajax_post_view, index

urlpatterns = [
    path('', index, name='index'),
    path('json-job-assignments-get/', ajax_get_view),
    path('json-job-assignments-post/', ajax_post_view),
]