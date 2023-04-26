from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import InfoPage
from krsp.serializers import InfoPageSerializer


class InfoPageView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = InfoPageSerializer
    queryset = InfoPage.objects.all()

    @action(methods=["POST"], detail=False)
    def get_info_page_data(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        page_name = request.data['page_name']
        info_page = InfoPage.objects.filter(page_name=page_name).first()
        return Response(data=info_page.page, status=status.HTTP_200_OK)
