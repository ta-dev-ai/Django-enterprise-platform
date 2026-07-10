from .site_config import SITE_CONTACT


def site_contact(request):
    return {"site": SITE_CONTACT}
