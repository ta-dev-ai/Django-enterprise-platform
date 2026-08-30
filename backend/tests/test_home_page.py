from django.test import TestCase
from django.urls import reverse


class HomePageTestCase(TestCase):
    def test_homepage_renders_successfully_with_hero_title(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Rénover votre maison,")
        self.assertContains(response, "illuminez votre avenir.")
        self.assertContains(response, "Lancer l'Analyse")

