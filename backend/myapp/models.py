from django.db import models
from django.conf import settings


# Create your models here.
class itemModel(models.Model):
    title = models.CharField(max_length=30)
    desc = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12,decimal_places=2)
    status = models.CharField(max_length=30)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, to_field="username", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created"]

