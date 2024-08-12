from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import random
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
import datetime
from django.contrib.auth.decorators import login_required
from .models import itemModel
from .serializers import (
    ChangePasswordSerializer,
    RegisterSerializer,
    UpdatePageSerializer,
    ItemSerializer,
    AddItemSerializer
)

def populate(request):
    # clearing the DB
    User.objects.all().delete()
    itemModel.objects.all().delete()

    #populating with no_u users and no_c itesms each
    no_u = 6
    no_items = 10
    no_sellers = 3

    try:
        price_list = ['100', '25', '12', '28', '55', '69']
        for n in range(no_u):
            user = User.objects.create_user("testuser{}".format(n), "testuser{}@shop.aa".format(n), "pass{}".format(n))
            user.save()

            if (n<no_sellers):
                for i in range(no_items):
                    item = itemModel(
                        
                        title="Item {}".format(i),
                        desc="A good item",
                        price=random.choice(price_list),
                        status="On sale",
                        owner=user,
                        
                        )
                    item.save()

        message = "Populated with {} users, of which {} are sellers, selling {} items each".format(no_u,no_sellers, no_items)
    except Exception as e:
        message = "Populate failed:  " + str(e)
    return JsonResponse({"message": message})


class AboutMeView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponse(request.user.get_username())



class SessionAboutMeView(AboutMeView):
    authentication_classes = [authentication.SessionAuthentication]


class RegisterView(APIView):
    """
    Register a new user
    """

    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response("not valid", status=400)
        try:
            user = User.objects.create_user(
                username=serializer.data["username"],
                email=serializer.data["email"],
                password=serializer.data["password"],
            )
        except IntegrityError:
            return Response(f"same user name", status=400)
        if user is not None:
            return Response(f"new user is: {user.get_username()}")
        return Response("no new user")


class changePassword(APIView):
    """
    Change a user's password
    """

    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response("Serializer error", status=400)
        user = request.user
        if user is None:
            return Response("User not authenticated", status=401)

        # Check if the old password is correct
        if not user.check_password(serializer.data['password']):
            return Response("Old password is not correct", status=400)

        # Set the new password
        user.set_password(serializer.data['newpassword'])
        user.save()

        return Response("Password has been changed successfully", status=200)


class LogoutView(APIView):
    """
    Logout a user
    """

    def post(self, request, format=None):
        if request.user.is_authenticated:
            logout(request)
            return Response("Successfully logged out")
        return Response("User is not logged in")

class AddItemView(APIView):
    '''
    this is used to add new items into the database
    '''
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = AddItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response("Serializer error", status=400)
        if request.user is None:
            return Response("User not authenticated", status=401)

        item = itemModel(
                        
            title=serializer.data["title"],
            desc=serializer.data["desc"],
            price=serializer.data["price"],
            status="On sale",
            owner=request.user,
            )
        item.save()
        return Response("new item added", status=200)

class PURCHASEDItemView(APIView):
    '''
    this is used to add duplicates items into the database, beloning to the buyer
    '''
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = AddItemSerializer(data=request.data)
        if not serializer.is_valid():
            return Response("Serializer error", status=400)
        if request.user is None:
            return Response("User not authenticated", status=401)

        item = itemModel(
                        
            title=serializer.data["title"],
            desc=serializer.data["desc"],
            price=serializer.data["price"],
            status="PURCHASED",
            owner=request.user,
            )
        item.save()
        return Response("new item added", status=200)


