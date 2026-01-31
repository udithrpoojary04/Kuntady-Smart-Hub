from django.contrib import admin
from .models import Bus, TransportService, Place, Feedback

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_number', 'bus_name', 'start_point', 'end_point', 'time')
    search_fields = ('bus_number', 'bus_name', 'start_point', 'end_point')

@admin.register(TransportService)
class TransportServiceAdmin(admin.ModelAdmin):
    list_display = ('service_type', 'provider_name', 'stand_location')
    list_filter = ('service_type',)

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    readonly_fields = ('created_at',)
