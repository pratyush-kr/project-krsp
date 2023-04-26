import re


def upload_path(instance, filename):
    return '/'.join(['img', re.sub('[^a-zA-Z0-9]]', '', str(instance.name)), filename])
