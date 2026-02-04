from rest_framework import viewsets, permissions
# from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Bus, TransportService, Place, Feedback
from .serializers import BusSerializer, TransportServiceSerializer, PlaceSerializer, FeedbackSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class TransportServiceViewSet(viewsets.ModelViewSet):
    queryset = TransportService.objects.all()
    serializer_class = TransportServiceSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class PlaceViewSet(viewsets.ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST': # Allow anyone to POST feedback
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ChatAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        query = request.data.get('query', '').lower()
        response_text = "I'm sorry, I didn't understand that. You can ask about buses, places, or transport services."
        data = []
        result_type = 'text'

        if not query:
             return Response({'response': "Please ask a question.", 'data': [], 'type': 'text'})

        # Bus Logic
        if 'bus' in query or 'time' in query or 'schedule' in query:
            buses = Bus.objects.all()
            matched_buses = []
            
            # 1. Check for specific locations mentioned in query
            # We iterate through all buses and check if their start/end/via points are in the query
            for bus in buses:
                # Check start/end points (words match)
                s_point = bus.start_point.lower()
                e_point = bus.end_point.lower()
                
                # Check via points
                via_points = [v.strip().lower() for v in bus.via.split(',')] if bus.via else []
                
                if (s_point in query and len(s_point) > 2) or \
                   (e_point in query and len(e_point) > 2) or \
                   any(v in query and len(v) > 2 for v in via_points):
                    matched_buses.append(bus)

            # 2. If no specific bus found but query is generic, maybe show all? 
            # Or if checking specific route like "mangalore" but matched multiple
            if not matched_buses and ('list' in query or 'all' in query):
                 matched_buses = buses
            
            if matched_buses:
                # Deduplicate if needed, but objects are unique
                serializer = BusSerializer(matched_buses, many=True)
                data = serializer.data
                response_text = f"Found {len(matched_buses)} relevant bus timings:"
                result_type = 'bus_list'
            else:
                if 'bus' in query:
                    response_text = "Which place are you looking for? Try asking 'Bus to Mangalore' or 'Buses available'."

        # Places Logic
        elif 'place' in query or 'tourist' in query or 'visit' in query or 'location' in query:
            places = Place.objects.all()
            # Filter if specific name mentioned? 
            matched_places = []
            for place in places:
                if place.name.lower() in query:
                    matched_places.append(place)
            
            if not matched_places:
                 matched_places = places # Show all if no specific match
            
            serializer = PlaceSerializer(matched_places, many=True)
            data = serializer.data
            response_text = "Here are some places to visit in Kuntady:"
            result_type = 'place_list'

        # Transport Services Logic
        elif 'auto' in query or 'rickshaw' in query or 'tempo' in query or 'driver' in query or 'contact' in query:
            services = TransportService.objects.all()
            serializer = TransportServiceSerializer(services, many=True)
            data = serializer.data
            response_text = "Here are the available transport service providers:"
            result_type = 'service_list'

        return Response({
            'response': response_text,
            'data': data,
            'type': result_type
        })
