from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):

    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'confirm_password')
        extra_kwargs = {
            'first_name' : {'required': True},
            'last_name' : {'required': True},
            'password' : {'write_only': True},
            'confirm_password' : {'write_only': True},
        }

    def save(self):
        """
        Save the user registration data to the database.
        This method creates a new user instance based on the validated data provided.
        It checks if a user with the same email already exists in the database. 
        If it does, a `ValidationError` is raised with the message "A user with that email already exists."
        If the passwords do not match, a `ValidationError` is raised with the message "Passwords do not match!".
        """
        user = User(
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            username=self.validated_data['username']
        )

        email=self.validated_data['email']
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if User.objects.filter(email=email):
            raise serializers.ValidationError(
                {'email': 'A user with that email already exists.'})

        if password != confirm_password:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match!'})

        user.email = email
        user.set_password(password)
        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')