from rest_framework import serializers
from .models import itemModel
from django.contrib.auth.models import User


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = itemModel
        fields = "__all__"

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "password")

class AddItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = itemModel
        fields = ("title", "price", "desc", "status")



class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})
    newpassword = serializers.CharField(style={"input_type": "password"})

class UpdatePageSerializer(serializers.ModelSerializer):
    updated = serializers.DateTimeField(required=True)

