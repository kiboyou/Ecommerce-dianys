from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission, SAFE_METHODS, IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken


from .serializer import UtilisateurSerialiezer, ChangerMotPasseSerializer, InfoUserSerializer
from .models import NouveauUtilisateur



class IsOwnerOrReadOnly(BasePermission):
    def has_object_permissions(self, request, view, obj):
        if request.method in SAFE_METHODS:
          return True
        return obj.owner == request.user



class CreationUtilisateur(APIView):
     Permission_classes = [IsAdminUser, IsOwnerOrReadOnly]


     def get(self, request, id=None, format=None):
          if id is not None:
               utilisateur = NouveauUtilisateur.objects.get(pk=id)
               serializer = UtilisateurSerialiezer(utilisateur)
               return Response({
                    'success': True,
                    'data': serializer.data
               })
          else:
               utilisateurs = NouveauUtilisateur.objects.all()
               serializer = UtilisateurSerialiezer(utilisateurs, many=True)
               return Response({
                    'success': True,
                    'data': serializer.data
               })


     def post(self, request, format=None):
          serializer = UtilisateurSerialiezer(data=request.data)
          if serializer.is_valid():
               user = serializer.save()
               if user:
                    return Response({
                         'success': True,
                         'message': 'Enregistrement effectué',
                         'data': serializer.data,
                         'status': status.HTTP_201_CREATED
                    })

          return Response({
               'data' : serializer.errors,
               'status' : status.HTTP_400_BAD_REQUEST,
               'message' : "BAD_REQUEST"
          })


     def put(self, request, id, format=None):
          if id is not None:
            utilisateur = NouveauUtilisateur.objects.get(pk=id)
            if utilisateur:
               serializer = UtilisateurSerialiezer(utilisateur, data=request.data)

               if serializer.is_valid():
                    serializer.save()
                    return Response({
                            'success': True,
                            'message': 'utilisateur modifier avec succes',
                            'data': serializer.data
                    })

          return Response({
               'success': True,
               'message': 'erreur',
               'data': serializer.errors
          })


     def delete(self, request, id, format=None):
          if id is not None:
               utilisateur = NouveauUtilisateur.objects.get(pk=id)
               if utilisateur:
                    utilisateur.delete()
                    return Response({
                         'success': True,
                         'message': 'utilisateur supprimer avec succes'
                    })
          return Response({
               'success': True,
               'message': 'erreur',
               'data': ''
          })


class ChangerMotPasseiew(UpdateAPIView):

     serializer_class = ChangerMotPasseSerializer
     model = NouveauUtilisateur
     permission_classes = (IsAuthenticated,)


     def get_object(self, queryset=None):
          obj = self.request.user
          return obj


     def update(self, request, *args, **kwargs):
          self.object = self.get_object()
          serializer = self.get_serializer(data=request.data)

          if serializer.is_valid():
               if not self.object.check_password(serializer.data.get("ancien_password")):
                    return Response({"ancien_password": ["Mauvais mot de passe"]}, status=status.HTTP_400_BAD_REQUEST)

               self.object.set_password(serializer.data.get("nouveau_password"))
               self.object.save()
               response = {
                    'status': 'success',
                    'code': status.HTTP_200_OK,
                    'message': 'mot de passe modifier avec succes',
                    'data': []
               }
               return Response(response)



class UserConnecter(APIView):
    permission_classes = (IsAuthenticated,)
    def get (self, request):
        print(request.user)
        utilisateur = NouveauUtilisateur.objects.get(id=request.user.id)
        user_data = InfoUserSerializer(utilisateur).data
        return Response(user_data)



class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)