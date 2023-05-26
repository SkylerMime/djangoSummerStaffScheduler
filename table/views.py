from django.shortcuts import render
from .models import JobAssignments
from django.http import JsonResponse
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

# from brennantymrak.com
def ajax_get_view(request):
    # Get data from the database
    # First, open the JobAssignments object
    obj = JobAssignments.objects.get_or_create(id=1)
    schedulingData = obj[0].data
    return JsonResponse({"received_data": schedulingData})

def ajax_post_view(request):
    if request.method == "POST":
        data_from_post = json.load(request)['post_data']
        # Store the data in the database
        obj = JobAssignments.objects.update_or_create(id=1)
        obj[0].data = data_from_post
        obj[0].save()

        # TODO: Do error checking to make sure this is a good json file
        return JsonResponse({"instance": data_from_post}, status=200)
    
    else:
        return JsonResponse({"error": ""}, status=400)