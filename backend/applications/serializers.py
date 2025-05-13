from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    image_url = serializers.SerializerMethodField()
    admin_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ('id', 'title', 'description', 'status', 'status_display', 
                 'created_at', 'updated_at', 'user_email', 'admin_comment',
                 'image', 'admin_image', 'image_url', 'admin_image_url')
        read_only_fields = ('created_at', 'updated_at', 'admin_comment', 'admin_image')

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    def get_admin_image_url(self, obj):
        if obj.admin_image:
            return self.context['request'].build_absolute_uri(obj.admin_image.url)
        return None

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data) 