from rest_framework import permissions
#used to set permissions to access the database tables

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission
    """

    def has_permission(self, request, view):
        #if the user is not authenticated, he has no permissions
        if not request.user.is_authenticated():
            return False
        # authenticated users are allowed to READ (GET, HEAD or OPTIONS) requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the admin user.
        return request.user.is_staff


class editUserDetails(permissions.BasePermission):
    """
    Custom permission
    """

    def has_permission(self, request, view):
        #only admin user can read other user information
        if request.method in permissions.SAFE_METHODS and not request.user.is_staff:
            return False
        # Any user can post a new request
        return True