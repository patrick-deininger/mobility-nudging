import graphene
from django.contrib.auth import get_user_model
from graphene import Field, String

from core.user_helper.jwt_util import get_token_user_id
from core.schema import User, Viewer

class UserQueries:
    viewer = Field(Viewer)
    users = graphene.List(User)
    user = graphene.Node.Field(User)

    def resolve_users(self, info, **args):
        return get_user_model().objects.select_related('books').all()

    def resolve_viewer(self, info, **args):
        try:
            token_user_id = get_token_user_id(args, info.context)
            user = get_user_model().objects.get(id=token_user_id)
            return Viewer(
                id=0,
                user=user
            )
        except BaseException:
            return Viewer(
                id=0,
                user=get_user_model()(
                    id=0,
                    email=""
                )
            )
