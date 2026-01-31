from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid

class Bus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bus_name = models.CharField(_('Bus Name'), max_length=100, default="")
    bus_number = models.CharField(_('Bus Number'), max_length=20, default="")
    start_point = models.CharField(_('Start Point'), max_length=100)
    end_point = models.CharField(_('End Point'), max_length=100)
    time = models.TimeField(_('Time'), default='00:00:00')
    via = models.TextField(_('Via (Stops)'), blank=True)

    def __str__(self):
        return f"{self.bus_number}: {self.start_point} - {self.end_point}"

class TransportService(models.Model):
    SERVICE_TYPES = [
        ('AUTO', _('Auto Rickshaw')),
        ('TEMPO', _('Tempo')),
        ('OTHER', _('Other')),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service_type = models.CharField(_('Service Type'), max_length=20, choices=SERVICE_TYPES)
    provider_name = models.CharField(_('Provider/Driver Name'), max_length=100)
    contact_number = models.CharField(_('Contact Number'), max_length=20, blank=True)
    stand_location = models.CharField(_('Stand Location'), max_length=100)
    service_area = models.TextField(_('Service Area'))

    def __str__(self):
        return f"{self.get_service_type_display()} - {self.provider_name}"

class Place(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('Name'), max_length=100)
    description = models.TextField(_('Description'))
    image = models.ImageField(_('Image'), upload_to='places/', blank=True, null=True)
    location_url = models.URLField(_('Location Map URL'), max_length=500, blank=True)

    def __str__(self):
        return self.name

class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('User Name'), max_length=100)
    email = models.EmailField(_('Email'))
    message = models.TextField(_('Message'))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.name}"
