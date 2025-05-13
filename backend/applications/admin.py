from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'created_at', 'image_preview', 'admin_image_preview')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'image_preview', 'admin_image_preview')
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'status', 'user')
        }),
        ('Изображения', {
            'fields': ('image', 'image_preview', 'admin_image', 'admin_image_preview')
        }),
        ('Комментарии', {
            'fields': ('admin_comment',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="150" height="150" style="object-fit: cover;" />'
        return "Нет изображения"
    image_preview.short_description = 'Фото пользователя'
    image_preview.allow_tags = True

    def admin_image_preview(self, obj):
        if obj.admin_image:
            return f'<img src="{obj.admin_image.url}" width="150" height="150" style="object-fit: cover;" />'
        return "Нет изображения"
    admin_image_preview.short_description = 'Фото ответа администратора'
    admin_image_preview.allow_tags = True
