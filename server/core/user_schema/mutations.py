from django.contrib.auth import authenticate, get_user_model
from graphene import relay, Field, String, ObjectType, Union, List

from core.user_helper.jwt_schema import TokensSuccess
from core.user_helper.jwt_util import get_jwt_token
from core.schema import Viewer


class Error(ObjectType):
    """Form Errors
        https://medium.com/@tarkus/validation-and-user-errors-in-graphql-mutations-39ca79cd00bf#.ts99uxfnr
    """
    key = String()
    message = String(required=True)


class FormErrors(ObjectType):
    """Form Errors
        https://medium.com/@tarkus/validation-and-user-errors-in-graphql-mutations-39ca79cd00bf#.ts99uxfnr
    """
    errors = List(Error)


class AuthFormUnion(Union):
    """Returns either token error or token success"""

    class Meta:
        types = (Viewer, FormErrors)


class LoginMutation(relay.ClientIDMutation):
    class Input:
        email = String(required=True)
        password = String(required=True)

    auth_form_payload = Field(AuthFormUnion)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        email = input.get('email')
        password = input.get('password')
        user_exists = get_user_model().objects.filter(email=email)
        errors = []
        if not user_exists:
            error = Error(
                key='email',
                message='A user with this email doesn\'t exist.')
            errors.append(error)
            return LoginMutation(FormErrors(errors))
        user_password_correct = user_exists[0].check_password(password)
        if not user_password_correct:
            error = Error(key='password', message='Password is incorrect')
            errors.append(error)
            return LoginMutation(FormErrors(errors))

        user = authenticate(username=email, password=password)
        jwt_token = get_jwt_token(user)

        if user and jwt_token:
            tokens = TokensSuccess(
                jwt_token
            )
            viewer = Viewer(
                user=user,
                tokens=tokens
            )
            return LoginMutation(viewer)


class SignupUserMutation(relay.ClientIDMutation):
    class Input:
        email = String(required=True)
        password = String(required=True)
        first_name = String(required=True)
        last_name = String(required=True)

    auth_form_payload = Field(AuthFormUnion)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        email = input.get('email')
        password = input.get('password')
        first_name = input.get('first_name')
        last_name = input.get('last_name')
        user = get_user_model().objects.filter(email=email)
        errors = []
        if not user:
            user = get_user_model().objects.create_user(email=email, password=password, first_name=first_name, last_name=last_name)
            jwt_token = get_jwt_token(user)
            token = TokensSuccess(
                token=jwt_token
            )
            viewer = Viewer(
                user=user,
                tokens=token
            )
            return SignupUserMutation(viewer)
        if user:
            error = Error(
                key='email',
                message='A user with this email already exists.')
            errors.append(error)
            return SignupUserMutation(FormErrors(errors))


class UserMutations:
    login = LoginMutation.Field()
    signup = SignupUserMutation.Field()
