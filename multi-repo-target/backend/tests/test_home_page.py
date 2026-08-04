from django.test import TestCase
from django.urls import reverse


class HomePageTestCase(TestCase):
    def test_swiss_homepage_uses_bento_layout_and_not_legacy_hero(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Portfolio technique")
        self.assertContains(response, "Plateforme data énergie bâtiment")
        self.assertNotContains(response, "Rénovez votre maison, illuminez votre avenir.")
