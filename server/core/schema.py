import graphene
from django.contrib.auth import get_user_model
from django.utils import timezone
from graphql import GraphQLError
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType, ObjectType
from core.user_helper.jwt_util import get_token_user_id
from core.user_helper.jwt_schema import TokensInterface
from .models import EventHistory as EventHistory,
    Nudge as NudgeModal,
    FeedbackConfig as FeedbackConfigModal,
    ContextConfig as ContextConfigModal,
    Session as SessionModal,
    SessionConfig as SessionConfigModal,
    SessionBlockConfig as SessionBlockConfigModal,
    Block as BlockModal,
    BlockConfig as BlockConfigModal,
    Experiment as ExperimentModal,
    Book as BookModal,
    BookshelfEntry as BookshelfEntryModal,
    BookRecommendationForFriend as BookRecommendationForFriendModal,
    Membership as MembershipModal,
    Group as GroupModal,
    GroupInvite as GroupInviteModal
from .utils import Utils
from .email import Email, EmailBuilder


class BlockConfig(DjangoObjectType):
    class Meta:
        model = BlockConfigModal
        filter_fields = [
            'name',
            'clocktime',
            'charge_status',
            'charge_distance',
            'time_to_full_charge',
            'flexibility_time_request',
            'flexibility_charge_level_request',
            'flexibility_time_provision',
            'flexibility_charge_level_provision',
            'full_charge_price',
            'nudge'
             ]
        interfaces = (graphene.Node, )

class Block(DjangoObjectType):
    class Meta:
        model = BlockModal
        filter_fields = ['user', 'block_config', 'started_at', 'finished_at']
        interfaces = (graphene.Node, )


class SessionConfig(DjangoObjectType):
    class Meta:
        model = SessionConfigModal
        filter_fields = ['name', 'number_of_sessions']
        interfaces = (graphene.Node, )

class Session(DjangoObjectType):
    class Meta:
        model = SessionModal
        filter_fields = ['session_config', 'user']
        interfaces = (graphene.Node, )

class Nudge(DjangoObjectType):
    class Meta:
        model = NudgeModal
        filter_fields = ['name', 'nudge_type']
        interfaces = (graphene.Node, )

class FeedbackConfig(DjangoObjectType):
    class Meta:
        model = FeedbackConfigModal
        filter_fields = ['name']
        interfaces = (graphene.Node, )

class ContextConfig(DjangoObjectType):
    class Meta:
        model = ContextConfigModal
        filter_fields = ['name']
        interfaces = (graphene.Node, )

class SessionBlockConfig(DjangoObjectType):
    class Meta:
        model = SessionBlockConfigModal
        filter_fields = ['session_config', 'block_config']
        interfaces = (graphene.Node, )


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

    block_config = graphene.Field(BlockConfig, id=graphene.ID())
    block_configs = graphene.List(BlockConfig)

    block = graphene.Field(Block, session=graphene.ID(), block_config=graphene.ID())
    blocks = graphene.List(Block)

    session_config = graphene.Field(SessionConfig, id=graphene.ID(), name=graphene.String())
    session_configs = graphene.List(SessionConfig)

    session = graphene.Field(Session, session_config=graphene.ID(), user=graphene.ID())
    sessions = graphene.List(Session)

    session_block_config = graphene.Node.Field(SessionBlockConfig, id=graphene.ID(), session_config=graphene.ID(), block_config=graphene.ID())
    session_block_configs = graphene.List(SessionBlockConfig, session_config=graphene.ID())

    nudge = graphene.Field(Nudge, id=graphene.ID(), name=graphene.String())
    nudge_configs = graphene.List(Nudge)

    feedback_configs = graphene.List(FeedbackConfig)

    context_configs = graphene.List(ContextConfig)

    def resolve_block_config(self, info, **args):
        if 'id' in args:
            return BlockConfigModal.objects.get(pk=args['id'])


    def resolve_block_configs(self, info, **args):
        block_configs = BlockConfigModal.objects.all()
        return block_configs

    def resolve_block(self, info, **args):
        block = BlockModal.objects.get(session=args['session'], block_config=args['block_config'])
        return block

    def resolve_blocks(self, info, **args):
        blocks = BlockModal.objects.all()
        return blocks

    def resolve_session_config(self, info, **args):
        if 'id' in args:
            return SessionConfigModal.objects.get(pk=args['id'])

        session_config = SessionConfigModal.objects.get(name=args['name'])
        return session_config

    def resolve_session_configs(self, info, **args):
        session_configs = SessionConfigModal.objects.all()
        return session_configs

    def resolve_session(self, info, **args):
        session = SessionModal.objects.get(session_config=args['session_config'], user=args['user'])
        return session

    def resolve_sessions(self, info, **args):
        sessions = SessionModal.objects.all()
        return sessions

    def resolve_session_block_config(self, info, **args):
        if 'id' in args:
            return SessionBlockConfigModal.objects.get(pk=args['id'])

    # TODO: Doesn't work
        session_block_config = SessionBlockConfigModal.objects.get(session_config = args['session_config'], block_config = args['block_config'])
        return session_block_config

    def resolve_session_block_configs(self, info, **args):
        session_block_configs = SessionBlockConfigModal.objects.all()
        return session_block_configs

    def resolve_nudge(self, info, **args):
        if 'id' in args:
            return NudgeModal.objects.get(pk=args['id'])

        nudge = NudgeModal.objects.get(name=args['name'])
        return nudge

    def resolve_nudge_configs(self, info, **args):
        nudge_configs = NudgeModal.objects.all()
        return nudge_configs

    def resolve_feedback_configs(self, info, **args):
        feedback_configs = FeedbackConfigModal.objects.all()
        return feedback_configs

    def resolve_context_configs(self, info, **args):
        context_configs = ContextConfigModal.objects.all()
        return context_configs




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

class CreateBlock(graphene.Mutation):
    class Arguments:
        user = graphene.ID(required=True)
        block_config = graphene.ID(required=True)
        session = graphene.ID(required=True)
        # started_at = graphene.types.datetime.DateTime(timezone.now)
        # finished_at = graphene.types.datetime.DateTime(timezone.now)

    block = graphene.Field(Block)

    def mutate(self, info, **args):

        get_node = graphene.Node.get_node_from_global_id
        user = get_node(info, args['user'])
        block_config = get_node(info, args['block_config'])
        session = get_node(info, args['session'])
        # started_at = timezone.now
        # finished_at = timezone.now
        block = BlockModal(
            user = user,
            session = session,
            block_config = block_config,
            block_status = 'running',
            # started_at = started_at,
            # finished_at = finished_at
        )
        block.save()
        return CreateBlock(block=block)

class FinishBlock(graphene.Mutation):
    class Arguments:
        block_id = graphene.ID(required=True)

    block = graphene.Field(Block)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        block = get_node(info, args['block_id'])
        #block.finished_at = timezone.now
        block.block_status = "finished"
        block.save()

        return FinishBlock(block=block)


class CreateSession(graphene.Mutation):
    class Arguments:
        user = graphene.ID(required=True)
        session_config = graphene.ID(required=True)

    session = graphene.Field(Session)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        user = get_node(info, args['user'])
        session_config = get_node(info, args['session_config'])

        session = SessionModal(
            user = user,
            session_config = session_config,
            session_status = 'running',
        )

        session.save()
        return CreateSession(session=session)



class FinishSession(graphene.Mutation):
    class Arguments:
        session_id = graphene.ID(required=True)

    session = graphene.Field(Session)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        session = get_node(info, args['session_id'])
        #session.finished_at = timezone.now
        session.session_status = "finished"
        session.save()

        return FinishSession(session=session)


class CreateSessionConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        number_of_sessions = graphene.Int(required=True)

    sessionConfig = graphene.Field(SessionConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        number_of_sessions = args['number_of_sessions']

        sessionConfig = SessionConfigModal(
            name = name,
            number_of_sessions = number_of_sessions,
        )

        sessionConfig.save()
        return CreateSessionConfig(sessionConfig=sessionConfig)


class CreateNudgeConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        heading = graphene.String(required=True)
        text = graphene.String(required=True)
        image = graphene.String(required=True)

    nudgeConfig = graphene.Field(Nudge)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        heading = args['heading']
        text = args['text']
        image = args['image']

        nudgeConfig = NudgeModal(
            name = name,
            description = description,
            heading = heading,
            text = text,
            image = image
        )

        nudgeConfig.save()
        return CreateNudgeConfig(nudgeConfig=nudgeConfig)


class CreateFeedbackConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        heading = graphene.String(required=True)
        text = graphene.String(required=True)

    feedbackConfig = graphene.Field(FeedbackConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        heading = args['heading']
        text = args['text']

        feedbackConfig = FeedbackConfigModal(
            name = name,
            description = description,
            heading = heading,
            text = text,
        )

        feedbackConfig.save()
        return CreateFeedbackConfig(feedbackConfig=feedbackConfig)

class CreateContextConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        heading = graphene.String(required=True)
        text = graphene.String(required=True)

    contextConfig = graphene.Field(ContextConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        heading = args['heading']
        text = args['text']

        contextConfig = ContextConfigModal(
            name = name,
            description = description,
            heading = heading,
            text = text,
        )

        contextConfig.save()
        return CreateContextConfig(contextConfig=contextConfig)


class CreateBlockConfig(graphene.Mutation):
    class Arguments:
        #clocktime =
        name = graphene.String(required=True)
        charge_status = graphene.Float(required=True)
        charge_distance = graphene.Float(required=True)
        time_to_full_charge = graphene.Float(required=True)
        flexibility_time_request = graphene.Float(required=True)
        flexibility_charge_level_request = graphene.Float(required=True)
        flexibility_time_provision = graphene.Float(required=True)
        flexibility_charge_level_provision = graphene.Float(required=True)
        full_charge_price = graphene.Float(required=True)
        nudge_id = graphene.ID(required=True)

    blockConfig = graphene.Field(BlockConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        #clocktime = args['clocktime']
        name = args['name']
        charge_status = args['charge_status']
        charge_distance = args['charge_distance']
        time_to_full_charge = args['time_to_full_charge']
        flexibility_time_request = args['flexibility_time_request']
        flexibility_charge_level_request = args['flexibility_charge_level_request']
        flexibility_time_provision = args['flexibility_time_provision']
        flexibility_charge_level_provision = args['flexibility_charge_level_provision']
        full_charge_price = args['full_charge_price']
        nudge = get_node(info, args['nudge_id'])

        blockConfig = BlockConfigModal(
            #clocktime = clocktime,
            name = name,
            charge_status = charge_status,
            charge_distance = charge_distance,
            time_to_full_charge = time_to_full_charge,
            flexibility_time_request = flexibility_time_request,
            flexibility_charge_level_request = flexibility_charge_level_request,
            flexibility_time_provision = flexibility_time_provision,
            flexibility_charge_level_provision = flexibility_charge_level_provision,
            full_charge_price = full_charge_price,
            nudge = nudge,

        )

        blockConfig.save()
        return CreateBlockConfig(blockConfig=blockConfig)


class CreateSessionBlockConfig(graphene.Mutation):
    class Arguments:
        session_config_id = graphene.ID(required=True)
        block_config_id = graphene.ID(required=True)

    sessionBlockConfig = graphene.Field(SessionBlockConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        session_config_id = get_node(info, args['session_config_id'])
        block_config_id = get_node(info, args['block_config_id'])


        sessionBlockConfig = SessionBlockConfigModal(
            session_config = session_config_id,
            block_config = block_config_id,
        )

        sessionBlockConfig.save()
        return CreateSessionBlockConfig(sessionBlockConfig=sessionBlockConfig)



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
    create_block = CreateBlock.Field()
    create_session = CreateSession.Field()
    create_session_config = CreateSessionConfig.Field()
    create_nudge_config = CreateNudgeConfig.Field()
    create_block_config = CreateBlockConfig.Field()
    create_session_block_config = CreateSessionBlockConfig.Field()
    finish_session = FinishSession.Field()
    finish_block = FinishBlock.Field()

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
