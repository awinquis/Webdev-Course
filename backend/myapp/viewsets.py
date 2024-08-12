from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, filters


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    
    permission_classes = [AllowAny]
   

    # Specifies which fields are searchable in the API
    search_fields = ['title']
    # Sets the filter backend to enable search functionality
    filter_backends = (filters.SearchFilter,)


        #make the query set only return items that are on sale
    def get_queryset(self):
        stat = "On sale"
        queryset = itemModel.objects.all().filter(status=stat)
        return queryset  

    #this query set returns all items of an authenticated user
class AuthItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return itemModel.objects.all().filter(owner=user)


class buyItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
  
    def get_queryset(self):
        stat = "On sale"
        queryset = itemModel.objects.all().filter(status=stat)
        return queryset  
