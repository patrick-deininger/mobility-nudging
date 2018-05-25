import graphene
from django.contrib.auth import get_user_model
from django.utils import timezone
from graphql import GraphQLError
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType, ObjectType
from core.user_helper.jwt_util import get_token_user_id
from core.user_helper.jwt_schema import TokensInterface
from .models import Event as EventModal, NudgeStatic as NudgeStaticModal, NudgeDynamic as NudgeDynamicModal, FeedbackConfig as FeedbackConfigModal, ContextConfig as ContextConfigModal, Session as SessionModal, SessionConfig as SessionConfigModal, SessionBlockConfig as SessionBlockConfigModal, Block as BlockModal, BlockConfig as BlockConfigModal, Experiment as ExperimentModal
from .utils import Utils


class BlockConfig(DjangoObjectType):
    class Meta:
        model = BlockConfigModal
        filter_fields = [
            'name',
            'context',
            'feedback',

            'clocktime',
            'charge_status',
            'charge_distance',

            'flexibility_time_request',
            'default_charge_level',
            'time_to_full_charge',
            'full_charge_price',
            'minimum_charge_level',

            'flexibility_time_provision',
            'saved_emissions',
            'avoided_environmental_costs',
            'avoided_energy_costs',

            'nudge_static',
            'nudge_dynamic'
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

class NudgeStatic(DjangoObjectType):
    class Meta:
        model = NudgeStaticModal
        filter_fields = ['name']
        interfaces = (graphene.Node, )

class NudgeDynamic(DjangoObjectType):
    class Meta:
        model = NudgeDynamicModal
        filter_fields = ['name']
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

class Event(DjangoObjectType):
    class Meta:
        model = EventModal
        filter_fields = ['event', 'user', 'block', 'session', 'screen']
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
        )
        interfaces = (graphene.Node, TokensInterface)
        filter_fields = []



class CoreQueries:
    block_config = graphene.Field(BlockConfig, id=graphene.ID())
    block_configs = graphene.List(BlockConfig)

    block = graphene.Field(Block, session=graphene.ID(), block_config=graphene.ID())
    blocks = graphene.List(Block)

    session_config = graphene.Field(SessionConfig, id=graphene.ID(), name=graphene.String())
    session_configs = graphene.List(SessionConfig)

    session = graphene.Field(Session, id=graphene.ID(), session_config=graphene.ID(), user=graphene.ID())
    sessions = graphene.List(Session)

    session_block_config = graphene.Node.Field(SessionBlockConfig, id=graphene.ID(), session_config=graphene.ID(), block_config=graphene.ID())
    session_block_configs = graphene.List(SessionBlockConfig, session_config=graphene.ID())

    nudge_static = graphene.Field(NudgeStatic, id=graphene.ID(), name=graphene.String())
    nudge_static_configs = graphene.List(NudgeStatic)

    nudge_dynamic = graphene.Field(NudgeDynamic, id=graphene.ID(), name=graphene.String())
    nudge_dynamic_configs = graphene.List(NudgeDynamic)

    feedback_configs = graphene.List(FeedbackConfig)

    context_configs = graphene.List(ContextConfig)

    events = graphene.List(Event)


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
        if 'id' in args:
            return SessionModal.objects.get(pk=args['id'])

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

    def resolve_nudge_static(self, info, **args):
        if 'id' in args:
            return NudgeStaticModal.objects.get(pk=args['id'])

        nudge_static = NudgeStaticModal.objects.get(name=args['name'])
        return nudge_static

    def resolve_nudge_static_configs(self, info, **args):
        nudge_static_configs = NudgeStaticModal.objects.all()
        return nudge_static_configs

    def resolve_nudge_dynamic(self, info, **args):
        if 'id' in args:
            return NudgeDynamicModal.objects.get(pk=args['id'])

        nudge_dynamic = NudgeDynamicModal.objects.get(name=args['name'])
        return nudge_dynamic

    def resolve_nudge_dynamic_configs(self, info, **args):
        nudge_dynamic_configs = NudgeDynamicModal.objects.all()
        return nudge_dynamic_configs

    def resolve_feedback_configs(self, info, **args):
        feedback_configs = FeedbackConfigModal.objects.all()
        return feedback_configs

    def resolve_context_configs(self, info, **args):
        context_configs = ContextConfigModal.objects.all()
        return context_configs

    def resolve_events(self, info, **args):
        events = EventModal.objects.all()
        return events


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
        description = graphene.String(required=True)
        number_of_sessions = graphene.Int(required=True)

    sessionConfig = graphene.Field(SessionConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        number_of_sessions = args['number_of_sessions']

        sessionConfig = SessionConfigModal(
            name = name,
            description = description,
            number_of_sessions = number_of_sessions,
        )

        sessionConfig.save()
        return CreateSessionConfig(sessionConfig=sessionConfig)


class CreateNudgeStaticConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        heading = graphene.String(required=True)
        text = graphene.String(required=True)
        image = graphene.String(required=True)

    nudgeStaticConfig = graphene.Field(NudgeStatic)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        heading = args['heading']
        text = args['text']
        image = args['image']

        nudgeStaticConfig = NudgeStaticModal(
            name = name,
            description = description,
            heading = heading,
            text = text,
            image = image
        )

        nudgeStaticConfig.save()
        return CreateNudgeStaticConfig(nudgeStaticConfig=nudgeStaticConfig)


class CreateNudgeDynamicConfig(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String(required=True)
        heading = graphene.String(required=True)
        text = graphene.String(required=True)
        image = graphene.String(required=True)

    nudgeDynamicConfig = graphene.Field(NudgeDynamic)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id
        name = args['name']
        description = args['description']
        heading = args['heading']
        text = args['text']
        image = args['image']

        nudgeDynamicConfig = NudgeDynamicModal(
            name = name,
            description = description,
            heading = heading,
            text = text,
            image = image
        )

        nudgeDynamicConfig.save()
        return CreateNudgeDynamicConfig(nudgeDynamicConfig=nudgeDynamicConfig)


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

        name = graphene.String(required=True)
        description = graphene.String(required=True)
        context = graphene.ID(required=True)
        feedback = graphene.ID(required=True)

        #clocktime =
        charge_status = graphene.Float(required=True)
        charge_distance = graphene.Float(required=True)
        representation_current_state = graphene.String(required=True)

        flexibility_time_request = graphene.Float(required=True)
        default_charge_level = graphene.Float(required=True)
        time_to_full_charge = graphene.Float(required=True)
        full_charge_price = graphene.Float(required=True)
        minimum_charge_level = graphene.Float(required=True)
        representation_target_state = graphene.String(required=True)

        flexibility_time_provision = graphene.Float(required=True)
        saved_emissions = graphene.Float(required=True)
        avoided_environmental_costs = graphene.Float(required=True)
        avoided_energy_costs = graphene.Float(required=True)

        nudge_static = graphene.ID(required=True)
        nudge_dynamic = graphene.ID(required=True)

    blockConfig = graphene.Field(BlockConfig)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id

        name = args['name']
        description = args['description']
        context = get_node(info, args['context'])
        feedback = get_node(info, args['feedback'])

        #clocktime = args['clocktime']
        charge_status = args['charge_status']
        charge_distance = args['charge_distance']
        representation_current_state = args['representation_current_state']

        flexibility_time_request = args['flexibility_time_request']
        default_charge_level = args['default_charge_level']
        time_to_full_charge = args['time_to_full_charge']
        full_charge_price = args['full_charge_price']
        minimum_charge_level = args['minimum_charge_level']
        representation_target_state = args['representation_target_state']

        flexibility_time_provision = args['flexibility_time_provision']
        saved_emissions = args['saved_emissions']
        avoided_environmental_costs = args['avoided_environmental_costs']
        avoided_energy_costs = args['avoided_energy_costs']

        nudge_static = get_node(info, args['nudge_static'])
        nudge_dynamic = get_node(info, args['nudge_dynamic'])

        blockConfig = BlockConfigModal(
            name = name,
            description = description,
            context = context,
            feedback = feedback,

            #clocktime = clocktime,
            charge_status = charge_status,
            charge_distance = charge_distance,
            representation_current_state = representation_current_state,

            flexibility_time_request = flexibility_time_request,
            default_charge_level = default_charge_level,
            time_to_full_charge = time_to_full_charge,
            full_charge_price = full_charge_price,
            minimum_charge_level = minimum_charge_level,
            representation_target_state = representation_target_state,

            flexibility_time_provision = flexibility_time_provision,
            saved_emissions = saved_emissions,
            avoided_environmental_costs = avoided_environmental_costs,
            avoided_energy_costs = avoided_energy_costs,

            nudge_static = nudge_static,
            nudge_dynamic = nudge_dynamic,

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

class CreateEvent(graphene.Mutation):
    class Arguments:
        event = graphene.String(required=True)
        user_id = graphene.ID(required=True)
        block_id = graphene.ID()
        session_id = graphene.ID()

        screen = graphene.String(required=True)

        provided_flexibility_time = graphene.Float(required=True)
        target_charging_level = graphene.Float(required=True)
        charging_level_representation = graphene.String(required=True)


    event = graphene.Field(Event)

    def mutate(self, info, **args):
        get_node = graphene.Node.get_node_from_global_id

        event = args['event']
        user_id = get_node(info, args['user_id'])
        block_id = get_node(info, args['block_id'])
        session_id = get_node(info, args['session_id'])

        screen = args['screen']

        provided_flexibility_time = args['provided_flexibility_time']
        target_charging_level = args['target_charging_level']
        charging_level_representation = args['charging_level_representation']


        event = EventModal(
            event = event,
            user = user_id,
            block = block_id,
            session = session_id,

            screen = screen,

            provided_flexibility_time = provided_flexibility_time,
            target_charging_level = target_charging_level,
            charging_level_representation = charging_level_representation,
        )

        event.save()
        return CreateEvent(event=event)


class CoreMutations:
    create_block = CreateBlock.Field()
    create_session = CreateSession.Field()
    create_session_config = CreateSessionConfig.Field()
    create_nudge_static_config = CreateNudgeStaticConfig.Field()
    create_nudge_dynamic_config = CreateNudgeDynamicConfig.Field()
    create_feedback_config = CreateFeedbackConfig.Field()
    create_context_config = CreateContextConfig.Field()
    create_block_config = CreateBlockConfig.Field()
    create_session_block_config = CreateSessionBlockConfig.Field()
    finish_session = FinishSession.Field()
    finish_block = FinishBlock.Field()
    create_event = CreateEvent.Field()


class Viewer(ObjectType, CoreQueries):
    id = graphene.GlobalID()
    user = graphene.Field(User, jwt_token=graphene.String())

    class Meta:
        interfaces = (TokensInterface,)
