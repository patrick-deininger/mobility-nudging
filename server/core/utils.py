import string
from random import *
from hashlib import sha256

class Utils:

    @staticmethod
    def generate_salt():
        min_char = 16
        max_char = 32
        allchar = string.ascii_letters + string.punctuation + string.digits
        return ''.join(choice(allchar) for x in range(randint(min_char, max_char)))

    @staticmethod
    def generate_verification_token(group, email):
        return sha256((email + str(group.id) + Utils.generate_salt()).encode('utf-8')).hexdigest()
