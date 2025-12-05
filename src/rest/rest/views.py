from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

@method_decorator(csrf_exempt, name='dispatch')
class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.
        try:
            todos = list(db.todos.find({}))
            result = []
            for todo in todos:
                result.append({
                    'id': str(todo['_id']),
                    'description': todo['description']
                })
            
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        # Implement this method - accept a todo item in a mongo collection, persist it using db instance above.
        try:
            data = request.data
            print(data)
            
            description = data.get('description')
            
            if not description:
                return Response(
                    {'error': 'description field is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            todo_doc = {
                'description': description
            }
            result = db.todos.insert_one(todo_doc)
            
            return Response({
                'id': str(result.inserted_id),
                'description': description
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

