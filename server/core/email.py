import boto3
from botocore.exceptions import ClientError

class Email:  

    def __init__(self, region='eu-west-1'):
        self.client = boto3.client('ses', region_name=region)
        self._sender = ''
        self._recipient = ''
        self._subject = ''
        self._text = ''
        self._charset = 'UTF-8'

    def recipient(self, recipient):
        self._recipient = recipient
        return self

    def charset(self, charset):
        self._charset = charset
        return self

    def sender(self, sender):
        self._sender = sender
        return self

    def text(self, text):
        self._text = text
        return self

    def subject(self, subject):
        self._subject = subject
        return self

    def send(self):
        #Provide the contents of the email.
        response = self.client.send_email(
            Destination={
                'ToAddresses': [
                    self._recipient,
                ],
            },
            Message={
                'Body': {
                    # 'Html': {
                        # 'Charset': self.charset,
                        # 'Data': self.body_html,
                    # },
                    'Text': {
                        'Charset': self._charset,
                        'Data': self._text,
                    },
                },
                'Subject': {
                    'Charset': self._charset,
                    'Data': self._subject,
                },
            },
            Source=self._sender,
        )
        # print(e.response['Error']['Message'])

class EmailBuilder:

    @staticmethod
    def build_new_user_invitation_email(invite, host, invitee):
        email = {
            'subject': '{}, you got invited by {} {} to join a Gutenberg group'.format(invitee['first_name'], host['first_name'], host['last_name']),
            'text': '{},\n\n{} {} invited you to join {}. Click the following link to join:\n\nhttp://gutenberg.kolja.es/accept/{}\n\nAll the best\nGutenberg'.format(invitee['first_name'], host['first_name'],host['last_name'], invite['group_name'], invite['verification_token'])
        }

        return email

    def build_existing_user_invitation_email(invite, host, invitee):
        email = {
            'subject': '{}, you got invited by {} {} to join a Gutenberg group'.format(invitee['first_name'], host['first_name'], host['last_name']),
            'text': '{},\n\n{} {} invited you to join {}. Click the following link to join:\n\nhttp://gutenberg.kolja.es/accept/{}\n\nYou can also accept the invitation at a later time from your account.\n\nAll the best\nGutenberg'.format(invitee['first_name'], host['first_name'],host['last_name'], invite['group_name'], invite['verification_token'])
        }

        return email
