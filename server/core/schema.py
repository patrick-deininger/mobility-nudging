import graphene
from django.contrib.auth import get_user_model
from graphql import GraphQLError
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType, ObjectType
from core.user_helper.jwt_util import get_token_user_id
from core.user_helper.jwt_schema import TokensInterface
from .models import Book as BookModal, BookshelfEntry as BookshelfEntryModal, BookRecommendationForFriend as BookRecommendationForFriendModal, Membership as MembershipModal, Group as GroupModal, GroupInvite as GroupInviteModal
from .utils import Utils
from .email import Email, EmailBuilder

class Book(DjangoObjectType):
    class Meta:
        model = BookModal
        filter_fields = ['author', 'title']
        interfaces = (graphene.Node, )

class BookshelfEntry(DjangoObjectType):
    class Meta:
        model = BookshelfEntryModal
        filter_fields = ['state', 'rating']
        interfaces = (graphene.Node, )

class BookRecommendationForFriend(DjangoObjectType):
    class Meta:
        model = BookRecommendationForFriendModal
        filter_fields = []
        interfaces = (graphene.Node, )

class Group(DjangoObjectType):
    class Meta:
        model = GroupModal
        interfaces = (graphene.Node, )
        filter_fields = []

class GroupInvite(DjangoObjectType):
    class Meta:
        model = GroupInviteModal
        filter_fields = ['group', 'email', 'consumed']
        interfaces = (graphene.Node, )

class Membership(DjangoObjectType):
    class Meta:
        model = MembershipModal
        filter_fields = ['group', 'user']
        interfaces = (graphene.Node, )

class User(DjangoObjectType):
    class Meta:
        model = get_user_model()
        only_fields = (
            'id',
            'last_login',
            'is_superuser',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_staff',
            'is_active',
            'date_joined',
            'profile_image',
            'sent_invites',
            'received_invites'
        )
        interfaces = (graphene.Node, TokensInterface)
        filter_fields = []

    # TODO(kolja): This is currently needed since M2M is still broken in Graphene 2.0.
    books = DjangoFilterConnectionField(BookshelfEntry)
    groups = DjangoFilterConnectionField(Membership)

    def resolve_books(self, info):
        return self.bookshelfentry_set.all()

    def resolve_groups(self, info):
        return self.membership_set.all()

class CoreQueries:
    book = graphene.Field(Book, id=graphene.ID(), title=graphene.String(), author=graphene.String())
    books = graphene.List(Book)
    books_autocompleted = graphene.List(Book, title=graphene.String())
    all_books = DjangoFilterConnectionField(Book)

    bookshelf_entry = graphene.Node.Field(BookshelfEntry)
    bookshelf_entries = graphene.List(BookshelfEntry)
    all_bookshelf_entries = DjangoFilterConnectionField(BookshelfEntry)

    membership = graphene.Node.Field(Membership)
    memberships = graphene.List(Membership)
    all_memberships = DjangoFilterConnectionField(Membership)

    group_invite = graphene.Field(GroupInvite, id=graphene.ID(), verification_token=graphene.String())
    all_group_invites = DjangoFilterConnectionField(GroupInvite)

    group = graphene.Field(Group, id=graphene.ID(), name_url=graphene.String())
    all_groups = DjangoFilterConnectionField(Group)

    def resolve_book(self, info, **args):
        if 'id' in args:
            return BookModal.objects.get(pk=args['id'])

        book = BookModal.objects.get(title=args['title'], author=args['author'])
        return book

    def resolve_group(self, info, **args):
        if 'id' in args:
            return GroupModal.objects.get(pk=args['id'])

        return GroupModal.objects.get(name_url=args['name_url'])

    def resolve_group_invite(self, info, **args):
        if 'id' in args:
            return GroupInviteModal.objects.get(pk=args['id'])

        return GroupInviteModal.objects.get(verification_token=args['verification_token'])

    def resolve_books(self, info, **args):
        books = BookModal.objects.all()
        return books

    def resolve_books_autocompleted(self, info, **args):
         return BookModal.objects.filter(title__icontains=args['title'])

    def resolve_bookshelf_entries(self, info, **args):
        bookshelf_entries = BookshelfEntryModal.objects.all()
        return bookshelf_entries

    def resolve_memberships(self, info, **args):
        memberships = MembershipModal.objects.all()
        return memberships


class CreateBook(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        author = graphene.String(required=True)

    book = graphene.Field(Book)

    def mutate(self, info, **args):
        title = args['title']
        author = args['author']
        book = BookModal(
                title = title,
                author = author
            )
        book.save()
        return CreateBook(book=book)

class CreateGroupInvite(graphene.Mutation):
    class Arguments:
        group_id = graphene.ID(required=True)
        invitee_email = graphene.String(required=True)
        invitee_first_name = graphene.String()
        invitee_last_name = graphene.String()
        host_id = graphene.ID(required=True)

    group_invite = graphene.Field(GroupInvite)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        group = get_node(info, args['group_id'])
        host = get_node(info, args['host_id'])
        # TODO(kolja): Throw if user or group not found
        email = args['invitee_email']
        first_name = args['invitee_first_name']
        last_name = args['invitee_last_name']
        verification_token = Utils.generate_verification_token(group, email)
        if get_user_model().objects.filter(email=email).exists():
            invitee = get_user_model().objects.get(email=email)
        else:
            invitee = None

        group_invite = None
        try:
            group_invite = GroupInviteModal(
                group=group,
                email=email,
                first_name=first_name,
                last_name=last_name,
                verification_token=verification_token,
                created_by=host,
                consumed=False,
                email_sent=False,
                invitee=invitee
            )
            group_invite.save()
        except Exception:
            raise GraphQLError('Invite was already sent to this email.')

        host_fields = {'first_name': host.first_name, 'last_name': host.last_name}
        invitee_fields = {'first_name': first_name, 'last_name': last_name}
        invite_fields = {'group_name': group.name, 'verification_token': verification_token}

        if invitee:
            content = EmailBuilder.build_existing_user_invitation_email(invite_fields, host_fields, invitee_fields)
        else:
            content = EmailBuilder.build_new_user_invitation_email(invite_fields, host_fields, invitee_fields)

        try:
            Email().recipient('kolja.esders@gmail.com').sender(email).subject(content['subject']).text(content['text']).send()
        except Exception:
            raise GraphQLError('Unable to send email.')

        group_invite.email_sent = True
        group_invite.save()

        return CreateGroupInvite(group_invite=group_invite)

class CreateBookRecommendationForFriend(graphene.Mutation):
    class Arguments:
        friend_email = graphene.String(required=True)
        first_name = graphene.String()
        last_name = graphene.String()
        host_id = graphene.ID(required=True)
        book_title = graphene.String(required=True)
        book_author = graphene.String(required=True)


    book_recommendation_for_friend = graphene.Field(BookRecommendationForFriend)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        book_title = args['book_title']
        book_author = args['book_author']
        host_id = get_node(info, args['host_id'])
        email = args['friend_email']
        first_name = args['first_name']
        last_name = args['last_name']
        book_recommendation_for_friend = BookRecommendationForFriendModal(
            created_by=host_id,
            friend_email=email,
            first_name=first_name,
            last_name=last_name,
            email_sent=False,
            book_title=book_title,
            book_author=book_author
        )
        book_recommendation_for_friend.save()

        #TODO Patrick: Send recommendation email

        return CreateBookRecommendationForFriend(book_recommendation_for_friend=book_recommendation_for_friend)

class AcceptGroupInvite(graphene.Mutation):
    class Arguments:
        invite_id = graphene.ID(required=True)
        verification_token = graphene.String(required=True)

    success = graphene.Boolean()
    reason = graphene.String()

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        verification_token = args['verification_token']
        invite = get_node(info, args['invite_id'])

        reason = ''
        success = False
        if invite.verification_token != verification_token:
            reason = 'Authorization missing to accept invitation.'
        elif invite.consumed:
            reason = 'Invitation has already been accepted.'
        else:
            invite.consumed = True
            invite.save()
            success = True

        return AcceptGroupInvite(success=success, reason=reason)

class CreateBookshelfEntry(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        book_id = graphene.ID(required=True)
        state = graphene.String(required=True)
        rating = graphene.Int(required=True)

    bookshelf_entry = graphene.Field(BookshelfEntry)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        state = args['state']
        rating = args['rating']
        user = get_node(info, args['user_id'])
        book = get_node(info, args['book_id'])
        bookshelf_entry = BookshelfEntryModal(
                user = user,
                book = book,
                state = state,
                rating = rating
            )
        bookshelf_entry.save()
        return CreateBookshelfEntry(bookshelf_entry=bookshelf_entry)


class UpdateRating(graphene.Mutation):
    class Arguments:
        bookshelf_entry_id = graphene.ID(required=True)
        rating = graphene.Int(required=True)

    bookshelf_entry = graphene.Field(BookshelfEntry)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        bookshelf_entry = get_node(info, args['bookshelf_entry_id'])
        rating = args['rating']
        bookshelf_entry.rating = rating
        bookshelf_entry.save()
        return UpdateRating(bookshelf_entry = bookshelf_entry)

class UpdateState(graphene.Mutation):
    class Arguments:
        bookshelf_entry_id = graphene.ID(required=True)
        state = graphene.String(required=True)

    bookshelf_entry = graphene.Field(BookshelfEntry)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        bookshelf_entry = get_node(info, args['bookshelf_entry_id'])
        state = args['state']
        bookshelf_entry.state = state
        bookshelf_entry.save()
        return UpdateState(bookshelf_entry = bookshelf_entry)

class UpdateUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)

    user = graphene.Field(User)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        user = get_node(info, args['user_id'])
        first_name = args['first_name']
        last_name = args['last_name']
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return UpdateUser(user=user)

class CreateMembership(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        group_id = graphene.ID(required=True)
        invite_id = graphene.ID()

    membership = graphene.Field(Membership)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        user = get_node(info, args['user_id'])
        group = get_node(info, args['group_id'])
        invite = get_node(info, args['invite_id']) if 'invite_id' in args else None

        membership = MembershipModal(
            user=user,
            group=group,
            invite=invite
        )
        membership.save()
        return CreateMembership(membership=membership)

class CreateGroup(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        name_url = graphene.String(required=True)

    group = graphene.Field(Group)

    def mutate(self, info, **args):
        name = args['name']
        name_url = args['name_url']
        group = GroupModal(name=name, name_url=name_url)
        group.save()
        return CreateGroup(group=group)

class CoreMutations:
    create_book = CreateBook.Field()
    create_bookshelf_entry = CreateBookshelfEntry.Field()
    create_membership = CreateMembership.Field()
    create_group = CreateGroup.Field()
    create_group_invite = CreateGroupInvite.Field()
    accept_group_invite = AcceptGroupInvite.Field()
    update_user = UpdateUser.Field()
    update_rating = UpdateRating.Field()
    update_state = UpdateState.Field()
    create_book_recommendation_for_friend = CreateBookRecommendationForFriend.Field()


class Viewer(ObjectType, CoreQueries):
    id = graphene.GlobalID()
    user = graphene.Field(User, jwt_token=graphene.String())

    class Meta:
        interfaces = (TokensInterface,)
